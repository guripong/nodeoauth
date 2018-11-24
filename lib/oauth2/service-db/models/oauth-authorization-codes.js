'use strict';

module.exports = function (sequelize, DataTypes) {
  const OauthAuthorizationCodes = sequelize.define('OauthAuthorizationCodes', {
        clientId: {
          field: 'client_id',
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          allowNull: false
        },
        userId: {
          field: 'user_id',
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          allowNull: false
        },
        authorizationCode: {
          field: 'authorization_code',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        expires: {
          field: 'expires',
          type: DataTypes.DATE
        },
        redirectUri: {
          field: 'redirect_uri',
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
        tableName: 'oauth_authorization_codes',
        freezeTableName: true,
        underscored: true,
        timestamps: false,
      });

  OauthAuthorizationCodes.associate = function associate(models) {
    OauthAuthorizationCodes.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    OauthAuthorizationCodes.belongsTo(models.OauthClients, {
      foreignKey: 'clientId'
    });
  };

  return OauthAuthorizationCodes;
};