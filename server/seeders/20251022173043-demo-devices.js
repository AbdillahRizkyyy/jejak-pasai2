"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const devices = [
      {
        user_id: 1,
        device_name: "Rifki's Laptop",
        device_identifier: "12331312",
        device_type: "desktop",
        last_active: new Date(),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 1,
        device_name: "Rifki's Phone",
        device_identifier: "42142132321",
        device_type: "android",
        last_active: new Date(),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        device_name: "John's PC",
        device_identifier: "42142144454",
        device_type: "desktop",
        last_active: new Date(),
        is_active: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        device_name: "John's iPhone",
        device_identifier: "3252535452",
        device_type: "android",
        last_active: new Date(),
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("Devices", devices);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Devices", null, {});
  },
};
