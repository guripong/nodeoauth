'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('OauthRefreshTokens', {
        clientId: {
          field: 'client_id',
          type: DataTypes.CHAR(100),
          primaryKey: true,
          allowNull: false
        },
        userId: {
          field: 'user_id',
          type: DataTypes.CHAR(100),
          primaryKey: true,
          allowNull: false
        },
        refreshToken: {
          field: 'refresh_token',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        expires: {
          field: 'expires',
          type: DataTypes.DATE
        },
        scope: {
          field: 'scope',
          type: DataTypes.CHAR(255),
          allowNull: false
        }
      },
      {
        tableName: 'oauth_refresh_tokens',
        freezeTableName: true,
        underscored: true,
        timestamps: false
      });
};