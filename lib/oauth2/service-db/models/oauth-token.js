'use strict';

module.exports = function (sequelize, DataTypes) {
  const OauthTokens = sequelize.define('OauthTokens', {
        clientIdx: {
          field: 'client_idx',
          type: DataTypes.CHAR(100),
          primaryKey: true,
          allowNull: false
        },
        userIdx: {
          field: 'user_idx',
          type: DataTypes.CHAR(100),
          primaryKey: true,
          allowNull: false
        },
        accessToken: {
          field: 'access_token',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        tokenExpires: {
          field: 'token_expires',
          type: DataTypes.DATE
        },
        refreshToken: {
          field: 'refresh_token',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        refreshTokenExpires: {
          field: 'refresh_token_expires',
          type: DataTypes.DATE
        },
        scope: {
          field: 'scope',
          type: DataTypes.CHAR(255),
          allowNull: false
        }
      },
      {
        tableName: 'oauth_tokens',
        freezeTableName: true,
        underscored: true,
        timestamps: false
      });

  OauthTokens.associate = (models) => {
    OauthTokens.belongsTo(models.OauthClients, {
      foreignKey: 'clientIdx',
      target: 'idx'
    });

    OauthTokens.belongsTo(models.User, {
      foreignKey: 'userIdx',
      target: 'idx'
    });
  };

  return OauthTokens;
};