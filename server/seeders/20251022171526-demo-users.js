"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("admin123", 10); // Ini passwordnya admin123

    await queryInterface.bulkInsert("Users", [
      {
        nama: "admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama: "John Doe",
        email: "john.doe@example.com",
        password: hashedPassword,
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
