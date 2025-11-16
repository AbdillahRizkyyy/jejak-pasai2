'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Kontak extends Model {
    static associate(models) {
      // Tidak ada relasi langsung, tabel berdiri sendiri
    }
  }

  Kontak.init({
    nama: DataTypes.STRING,
    email: DataTypes.STRING,
    pesan: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Kontak',
  });

  return Kontak;
};
