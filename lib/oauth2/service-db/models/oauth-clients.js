'use strict';

module.exports = function (sequelize, DataTypes) {
  const OauthClients = sequelize.define('OauthClients', {
        idx: {
          field: 'idx',
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          field: 'name',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        clientId: {
          field: 'client_id',
          type: DataTypes.CHAR(255),
        },
        clientSecret: {
          field: 'client_secret',
          type: DataTypes.CHAR(80),
          allowNull: false
        },
        redirectUris: {
          field: 'redirect_uris',
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        grants: {
          field: 'grant_types',
          type: DataTypes.CHAR(80),
          allowNull: false
        },
        scope: {
          field: 'scope',
          type: DataTypes.CHAR(255),
          allowNull: false
        }
      },
      {
        tableName: 'oauth_clients',
        freezeTableName: true,
        underscored: true,
        timestamps: false
      });

  return OauthClients;
};