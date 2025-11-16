import rateLimit from "express-rate-limit";

/**
 * Rate limiter untuk endpoint autentikasi (login, register, dll)
 * Mencegah brute force attacks
 */
export const authLimiter = rateLimit({
  windowMs: 1000 * 60 * (Number(process.env.ACCOUNT_LOCK_TIME) || 15),
  max: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  message: {
    error: true,
    message:
      "Terlalu banyak percobaan register atau login. Silakan coba lagi nanti!",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => req.body.email || ipKeyGenerator(req), // Gunakan email sebagai key jika tersedia
});

/**
 * Rate limiter umum untuk endpoint ringan
 * 60 requests per menit per IP
 */
export const defaultLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 menit
  max: 120, // 120 request per menit per IP
  message: {
    error: true,
    message: "Terlalu banyak request ke server. Silakan coba lagi nanti!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter untuk API endpoints yang lebih ketat
 * Cocok untuk operasi yang lebih resource-intensive
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // 100 request per 15 menit
  message: {
    error: true,
    message: "Terlalu banyak request API. Silakan coba lagi nanti!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter untuk operasi yang sangat sensitif
 * Contoh: forgot password, email verification
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 jam
  max: 3, // 3 request per jam
  message: {
    error: true,
    message: "Terlalu banyak percobaan. Silakan coba lagi dalam 1 jam!",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Factory function untuk membuat custom rate limiter
 * @param {number} maxRequests - Jumlah maksimum request
 * @param {number} minutes - Durasi window dalam menit
 * @param {Object} options - Opsi tambahan (optional)
 * @returns {Function} Express rate limiter middleware
 *
 * @example
 * // Limit 10 request per 5 menit
 * const uploadLimiter = routeLimiter(10, 5);
 * app.post('/upload', uploadLimiter, uploadController);
 */
export const routeLimiter = (maxRequests, minutes, options = {}) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    message: {
      error: true,
      message: `Terlalu banyak request. Batas ${maxRequests} request per ${minutes} menit.`,
    },
    standardHeaders: true,
    legacyHeaders: false,
    ...options, // Untuk override default settings
  });
};

/**
 * Handler ketika rate limit tercapai (optional)
 * Bisa digunakan untuk logging atau alert
 */
export const rateLimitHandler = (req, res, next, options) => {
  // Log untuk monitoring
  console.warn(`Rate limit exceeded: ${req.ip} - ${req.path}`);

  // Bisa tambahkan alert ke monitoring system (Sentry, etc)
  // alertMonitoring({ type: 'rate-limit', ip: req.ip, path: req.path });

  res.status(429).json({
    error: true,
    message: "Terlalu banyak request. Silakan coba lagi nanti!",
  });
};

/**
 * Skip rate limiting untuk IP tertentu (whitelist)
 * Contoh: internal services, trusted IPs
 */
export const skipLimiting = (req) => {
  const trustedIPs = (process.env.TRUSTED_IPS || "").split(",").filter(Boolean);
  return trustedIPs.includes(req.ip);
};

// Contoh penggunaan skip function:
export const limiterWithWhitelist = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  skip: skipLimiting,
  message: {
    error: true,
    message: "Terlalu banyak request. Silakan coba lagi nanti!",
  },
});

export default {
  authLimiter,
  defaultLimiter,
  apiLimiter,
  strictLimiter,
  routeLimiter,
  rateLimitHandler,
  skipLimiting,
  limiterWithWhitelist,
};
