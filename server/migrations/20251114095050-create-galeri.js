'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Galeris', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      destinasi_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Destinasis', key: 'id' },
        onDelete: 'CASCADE'
      },
      judul: { type: Sequelize.STRING },
      file: { type: Sequelize.STRING },
      tipe: { type: Sequelize.ENUM('foto', 'video'), defaultValue: 'foto' },
      uploadedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Galeris');
  }
};
