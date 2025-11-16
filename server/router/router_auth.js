const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { sequelize, User, Device, Session } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { authLimiter, routeLimiter } = require("../middleware/rateLimiters");
const { authenticateToken } = require("../middleware/auth");

// Helper: Generate JWT Token
const generateToken = (userId, deviceId) => {
  return jwt.sign(
    { userId, deviceId },
    process.env.JWT_SECRET || "iJDhSEraPbSq3YUGYKcDhylOPmv/wm6K1sP/uhngyoY=",
    { expiresIn: `10m` || "7d" }
  );
};

// Helper: Generate Refresh Token
const generateRefreshToken = () => {
  return jwt.sign(
    { type: "refresh", nonce: uuidv4() },
    process.env.REFRESH_TOKEN_SECRET ||
      "0tn0Wd3R86DOqjByK/KdI8SJ/icZV/RrFg1dPo/r8ic=",
    { expiresIn: `7d` || "30d" }
  );
};

// Helper: Generate Crypto Hash
const hashUserId = (userId) =>
  crypto.createHash("sha256").update(String(userId)).digest("hex").slice(0, 12);

/**
 * POST /api/auth/register
 * Register user baru
 */
router.post("/auth/register", authLimiter, async (req, res) => {
  try {
    let { nama, email, password } = req.body;

    nama = nama.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // Validation
    if (!nama || !email || !password) {
      return res.status(400).json({
        error: true,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "Email sudah terdaftar",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: "Password minimal 6 karakter",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_ROUNDS) || 10
    );

    // Create user
    const user = await User.create({
      nama,
      email,
      password: hashedPassword,
      is_active: true,
    });

    res.status(201).json({
      error: false,
      message: "Registrasi berhasil",
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      error: true,
      message: "Gagal melakukan registrasi",
    });
  }
});

/**
 * POST /api/auth/login
 * Login user dan register device
 */
router.post("/auth/login", authLimiter, async (req, res) => {
  try {
    const { email, password, device_name, device_identifier, device_type } =
      req.body;

    // Validation
    if (!email || !password || !device_name || !device_identifier) {
      return res.status(400).json({
        error: true,
        message:
          "Email, password, device_name, dan device_identifier wajib diisi",
      });
    }

    // Find user
    const user = await User.findOne({
      where: { email },
      raw: true,
      nest: true,
    });
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Email atau password salah",
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        error: true,
        message: "Akun Anda tidak aktif",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: "Email atau password salah",
      });
    }

    let existingDevice = await Device.findOne({
      attributes: ["id", "user_id", "device_identifier"],
      where: { device_identifier },
      raw: true,
      nest: true,
    });

    if (existingDevice && existingDevice.user_id !== user.id) {
      return res.status(403).json({
        error: true,
        message: "Device identifier sudah terdaftar pada user lain",
      });
    }

    // Find or create device
    let device = await Device.findOne({
      where: {
        user_id: user.id,
        device_identifier: device_identifier,
      },
    });

    try {
      let t = await sequelize.transaction();
      if (!device) {
        // Create new device
        await Device.create(
          {
            user_id: user.id,
            device_name,
            device_identifier,
            device_type: device_type || "android",
            is_active: true,
            last_active: new Date(),
          },
          { transaction: t }
        );
      } else {
        // Update existing device
        await device.update(
          {
            device_name,
            device_type: device_type || device.device_type,
            is_active: true,
            last_active: new Date(),
          },
          { transaction: t }
        );
      }
      await t.commit();
    } catch (error) {
      console.error("Transaction error:", error);
      await t.rollback();
      return res.status(500).json({
        error: true,
        message: "Gagal melakukan login",
      });
    }

    // Find device
    device = await Device.findOne({
      where: {
        user_id: user.id,
        device_identifier: device_identifier,
      },
      raw: true,
      nest: true,
    });

    // Generate tokens
    const token = generateToken(user.id, device.id);
    const refreshToken = generateRefreshToken();

    // Calculate token expiry
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(process.env.JWT_EXPIRES_IN || 7)
    ); // 7 days

    // Create or update session
    try {
      t = await sequelize.transaction();
      await Session.destroy({
        where: {
          user_id: user.id,
          device_id: device.id,
        },
        transaction: t,
      });

      await Session.create(
        {
          user_id: user.id,
          device_id: device.id,
          token,
          refresh_token: refreshToken,
          expires_at: expiresAt,
        },
        { transaction: t }
      );
      await t.commit();
    } catch (error) {
      console.error("Transaction error:", error);
      await t.rollback();
      return res.status(500).json({
        error: true,
        message: "Gagal melakukan login",
      });
    }

    // Setelah generate token, set sebagai cookie
    res
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true jika HTTPS
        sameSite: "strict",
        maxAge: parseInt(process.env.JWT_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000, // 7 hari dalam ms
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:
          parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || 30) *
          24 *
          60 *
          60 *
          1000, // 30 hari
      })
      .json({
        error: false,
        message: "Login berhasil",
        data: {
          user: {
            id: user.id,
            nama: user.nama,
            email: user.email,
            is_active: user.is_active,
            profile_picture: user.profile_picture
              ? path.join(
                  process.env.PUBLIC_PATH,
                  "profile",
                  user.profile_picture
                )
              : null,
            createdAt: user.createdAt,
          },
          device: {
            id: device.id,
            name: device.device_name,
            type: device.device_type,
          },
          expiresAt,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: true,
      message: "Gagal melakukan login",
    });
  }
});

/**
 * GET /api/auth/verify
 * Mengecek apakah user sedang login
 */
router.get("/auth/verify", async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.json({ authenticated: false });
    }

    const session = await Session.findOne({
      where: { token },
      attributes: ["expires_at"],
      raw: true,
      nest: true,
    });

    if (session) {
      return res.json({ authenticated: true });
    } else {
      return res.json({ authenticated: false });
    }
  } catch {
    return res.json({ authenticated: false });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post("/auth/refresh", async (req, res) => {
  try {
    // Baca refresh token dari cookie (yang httpOnly)
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: true,
        authenticated: false,
        message: "Refresh token tidak ditemukan",
      });
    }

    // Verify refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET ||
        "0tn0Wd3R86DOqjByK/KdI8SJ/icZV/RrFg1dPo/r8ic="
    );

    // Find session
    const session = await Session.findOne({
      where: { refresh_token: refreshToken },
      include: [
        { model: User, as: "user" },
        { model: Device, as: "device" },
      ],
    });

    if (!session) {
      return res.status(401).json({
        error: true,
        authenticated: false,
        message: "Invalid refresh token",
      });
    }

    // Check if session expired
    if (new Date() > new Date(session.expires_at)) {
      await session.destroy();
      return res.status(401).json({
        error: true,
        authenticated: false,
        message: "Session expired, please login again",
      });
    }

    // Generate new tokens
    const newToken = generateToken(session.user_id, session.device_id);
    const newRefreshToken = generateRefreshToken();

    // Update session
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(process.env.JWT_EXPIRES_IN || 7)
    );

    await session.update({
      token: newToken,
      refresh_token: newRefreshToken,
      expires_at: expiresAt,
    });

    // Set cookies baru
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || 30) *
        24 *
        60 *
        60 *
        1000,
    });

    res.json({
      error: false,
      authenticated: true,
      message: "Token refreshed",
      data: {
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      error: true,
      message: "Invalid or expired refresh token",
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout dari device
 */
router.post("/auth/logout", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token tidak ditemukan",
      });
    }

    // Decode Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "iJDhSEraPbSq3YUGYKcDhylOPmv/wm6K1sP/uhngyoY="
    );

    if (!decoded) {
      return res.status(400).json({
        error: true,
        message: "Token tidak valid",
      });
    }

    await Session.destroy({
      where: { token },
      transaction: t,
    });

    await Device.update(
      { is_active: false },
      { where: { id: decoded.deviceId }, transaction: t }
    );

    await t.commit();

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({
      error: false,
      message: "Logout berhasil",
    });
  } catch (error) {
    await t.rollback();
    console.error("Logout error:", error);
    return res.status(500).json({
      error: true,
      message: "Gagal logout",
    });
  }
});

/**
 * POST /api/auth/logout-all
 * Logout dari semua device
 */
router.post("/auth/logout-all", async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(400).json({
        error: true,
        message: "Token tidak ditemukan",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "iJDhSEraPbSq3YUGYKcDhylOPmv/wm6K1sP/uhngyoY="
    );

    // Delete all sessions for this user
    await Session.destroy({
      where: { user_id: decoded.userId },
      transaction: t,
    });

    await t.commit();

    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
      error: false,
      message: "Logout dari semua device berhasil",
    });
  } catch (error) {
    console.error("Logout all error:", error);
    res.status(500).json({
      error: true,
      message: "Gagal logout",
    });
  }
});

/**
 * GET /api/auth/me
 * Menampilkan user yang sedang login
 */
router.get("/auth/me", async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "iJDhSEraPbSq3YUGYKcDhylOPmv/wm6K1sP/uhngyoY="
    );

    const user = await User.findByPk(decoded.userId, {
      attributes: [
        "id",
        "nama",
        "email",
        "is_active",
        "profile_picture",
        "createdAt",
      ],
      include: [
        {
          model: Device,
          as: "devices",
          where: { id: decoded.deviceId },
          attributes: ["id", "device_name", "device_type", "last_active"],
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User tidak ditemukan",
      });
    }

    res.json({
      error: false,
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        is_active: user.is_active,
        profile_picture: user.profile_picture
          ? path.join(process.env.PUBLIC_PATH, "profile", user.profile_picture)
          : null,
        createdAt: user.createdAt,
        devices: {
          id: user.devices.id,
          name: user.devices.device_name,
          type: user.devices.device_type,
          last_active: user.devices.last_active,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(401).json({
      error: true,
      message: "Invalid token",
    });
  }
});

/**
 * POST /api/auth/edit-profile
 * Edit profile + upload foto
 */
const uploadPath = path.join(
  __dirname,
  "../",
  process.env.UPLOAD_PATH,
  "profile"
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath))
      fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const hashedId = hashUserId(req.userId);
    cb(null, `P${hashedId}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // maksimal 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Format gambar tidak valid (hanya JPG, PNG)"));
    }
    cb(null, true);
  },
});

router.post(
  "/auth/edit-profile",
  routeLimiter(5, 5), // Limit 5 request per 5 menit
  authenticateToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const user_id = req.userId;
      let { nama, email, password, current_password } = req.body;

      nama = nama ? nama.trim() : null;
      email = email ? email.trim().toLowerCase() : null;
      password = password ? password.trim() : null;
      current_password = current_password ? current_password.trim() : null;

      const user = await User.findByPk(user_id);

      if (!user) {
        if (req.file) {
          const oldPath = path.join(uploadPath, req.file.filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        return res.status(404).json({
          error: true,
          message: "User tidak ditemukan",
        });
      }

      if (!current_password) {
        if (req.file) {
          const oldPath = path.join(uploadPath, req.file.filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        return res.status(400).json({
          error: true,
          message: "Password wajib diisi",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        current_password,
        user.password
      );

      if (!isPasswordValid) {
        if (req.file) {
          const oldPath = path.join(uploadPath, req.file.filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        return res.status(400).json({
          error: true,
          message: "Password salah",
        });
      }

      if (!user) {
        if (req.file) {
          const oldPath = path.join(uploadPath, req.file.filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        return res.status(404).json({
          error: true,
          message: "User tidak ditemukan",
        });
      }

      if (user.email !== email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          const oldPath = path.join(uploadPath, req.file.filename);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          return res.status(400).json({
            error: true,
            message: "Email sudah terdaftar",
          });
        }
      }

      user.nama = nama;
      user.email = email;
      if (password)
        user.password = await bcrypt.hash(
          password,
          parseInt(process.env.BCRYPT_ROUNDS) || 10
        );

      // Handle foto profil
      if (req.file) {
        if (user.profile_picture) {
          const oldPath = path.join(uploadPath, user.profile_picture);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        user.profile_picture = req.file.filename;
      }

      await user.save();
      res.json({
        error: false,
        message: "Profil berhasil diubah",
        data: {
          nama: user.nama,
          email: user.email,
          profile_picture: user.profile_picture
            ? `${process.env.PUBLIC_PATH}/profile/${user.profile_picture}`
            : null,
        },
      });
    } catch (error) {
      console.error("Edit profile error:", error);
      res.status(500).json({
        error: true,
        message: "Gagal mengubah profil",
      });
    }
  }
);

module.exports = router;
