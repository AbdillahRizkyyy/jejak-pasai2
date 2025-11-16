'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Destinasis', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      nama_destinasi: { type: Sequelize.STRING },
      slug: { type: Sequelize.STRING, unique: true },
      deskripsi: { type: Sequelize.TEXT },
      gambar: { type: Sequelize.STRING },
      alamat: { type: Sequelize.STRING },
      koordinat: { type: Sequelize.STRING },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Destinasis');
  }
};
