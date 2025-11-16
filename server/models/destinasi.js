'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Destinasi extends Model {
    static associate(models) {
      // Relasi: 1 destinasi bisa punya banyak galeri
      Destinasi.hasMany(models.Galeri, {
        foreignKey: 'destinasi_id',
        onDelete: 'CASCADE',
      });
    }
  }

  Destinasi.init({
    nama_destinasi: DataTypes.STRING,
    slug: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    gambar: DataTypes.STRING,
    alamat: DataTypes.STRING,
    koordinat: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Destinasi',
  });

  return Destinasi;
};
