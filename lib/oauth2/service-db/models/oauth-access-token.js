'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('OauthAccessTokens', {
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
        accessToken: {
          field: 'access_token',
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
        tableName: 'oauth_access_tokens',
        freezeTableName: true,
        underscored: true,
        timestamps: false
      });
};