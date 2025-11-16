const { Device } = require("../../../models");
const dayjs = require("dayjs");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async get_device() {
    const userId = this.req.user.id;
    try {
      const devices = await Device.findAndCountAll({
        where: {
          user_id: userId,
          is_active: true,
        },
        order: [["createdAt", "DESC"]],
        attributes: [
          "id",
          "device_name",
          "device_type",
          "last_active",
          "createdAt",
        ],
        raw: true,
        nest: true,
      });

      return {
        data: devices.rows.map((device) => ({
          id: device.id,
          device_name: device.device_name,
          device_type: device.device_type,
          last_active: device.last_active
            ? dayjs(device.last_active).format("YYYY-MM-DD HH:mm:ss")
            : null,
          createdAt: dayjs(device.createdAt).format("YYYY-MM-DD HH:mm:ss"),
        })),
        total: devices.count,
      };
    } catch (error) {
      console.error("Error fetching devices:", error);
      return { error: true, message: error.message };
    }
  }
}

module.exports = Model_r;
