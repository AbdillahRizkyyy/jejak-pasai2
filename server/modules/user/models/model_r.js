const { Op, User } = require("../../../models");

class Model_r {
  constructor(req) {
    this.req = req;
  }

  async user_profile() {
    const userId = this.req.userId;

    const data = await User.findOne({
      where: { id: userId },
      attributes: ["id", "nama", "email", "is_active", "createdAt"],
      raw: true,
      nest: true,
    });

    return data;
  }
}

module.exports = Model_r;
