'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi: User bisa punya banyak artikel sejarah
      User.hasMany(models.ArtikelSejarah, {
        foreignKey: 'penulis_id',
        onDelete: 'SET NULL',
      });
    }
  }

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('admin'),
      defaultValue: 'admin',
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
