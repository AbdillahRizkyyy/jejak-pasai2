'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Galeri extends Model {
    static associate(models) {
      // Relasi: Galeri milik satu destinasi
      Galeri.belongsTo(models.Destinasi, {
        foreignKey: 'destinasi_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Galeri.init({
    destinasi_id: DataTypes.INTEGER,
    judul: DataTypes.STRING,
    file: DataTypes.STRING,
    tipe: {
      type: DataTypes.ENUM('foto', 'video'),
      defaultValue: 'foto',
    },
  }, {
    sequelize,
    modelName: 'Galeri',
  });

  return Galeri;
};
