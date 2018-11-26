'use strict';

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
        idx: {
          field: 'idx',
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        userName: {
          field: 'user_name',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        password: {
          field: 'password',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        scope: {
          field: 'scope',
          type: DataTypes.CHAR(255),
          allowNull: false
        }
      },
      {
        tableName: 'user',
        freezeTableName: true,
        underscored: true,
        timestamps: false
      });

  return User;
};