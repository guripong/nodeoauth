'use strict';

const path = require('path');
const SequelizeModel = require('../../db/sequelize-model');
const {oauth2} = require('../../db/sequelize-handler');

class ServiceDB extends SequelizeModel {
  constructor() {
    super(path.join(__dirname, 'models'), oauth2);
  }

  getClient(clientId, clientSecret) {
    const options = {
      where: {clientId}
    };

    if (clientSecret) options.where.clientSecret = clientSecret;

    return this.OauthClients.findOne(options).then((client) => {
      if (!client) return new Error('client not found');
      const {dataValues} = client;
      const ret = Object.assign({}, dataValues);

      ret.grants = ret.grants.toString().split(',');
      ret.redirectUris = ret.redirectUris.toString().split(',');
      return ret;
    }).catch(function (err) {
      console.log("getClient - Err: ", err)
    });
  }

  getUser(username, password) {
    const option = {
      where: {userName: username, password}
    };
    return this.User.findOne(option).then((user) => {
      const {dataValues} = user;
      return Object.assign({}, dataValues);
    }).catch(e => console.log(e));
  }

  saveToken(token, client, user) {
    console.log(token, client, user);

    return Promise.all([
      this.OauthAccessTokens.upsert({
        accessToken: token.accessToken,
        expires: token.accessTokenExpiresAt,
        clientId: client.id,
        userId: user.id,
        scope: client.scope
      }),
      token.refreshToken ? this.OauthRefreshTokens.upsert({
        refreshToken: token.refreshToken,
        expires: token.refreshTokenExpiresAt,
        clientId: client.id,
        userId: user.id,
        scope: client.scope
      }) : []
    ]).then(() => {
      return Object.assign({}, {
        client: client,
        user: user,
        accessToken: token.accessToken, // proxy
        refreshToken: token.refreshToken, // proxy
      })
    }).catch(e => {
      console.log(e);
    });
  }

  getAccessToken(bearerToken) {
    return this.OauthAccessTokens.findOne({
      where: {accessToken: bearerToken},
      include: [
        {
          model: this.User,
          attributes: ['id', 'user_name']
        }, this
      ]
    }).then((accessToken) => {
      if (!accessToken) return false;
      const token = accessToken.toJSON();
      token.user = token.User;
      token.client = token.OAuthClient;
      token.scope = token.scope
      return token;
    }).catch((err) => {
      console.log("getAccessToken - Err: ", err);
    });
  }


  getAuthorizationCode(code) {
    return this.OauthAuthorizationCodes.findOne({
      where: { authorizationCode: code },
      include: [ this.OauthClients, this.User ]
    }).then((authCodeModel) => {
      const {dataValues, OauthClient, User} = authCodeModel;
      if (!dataValues || !OauthClient || !User) return false;
      const client = OauthClient.dataValues;
      const user = User.dataValues;
      return {
        code,
        client,
        expiresAt: dataValues.expires,
        redirectUri: dataValues.redirectUris,
        user,
        scope: user.scope,
      };
    }).catch(function (err) {
      console.log("getAuthorizationCode - Err: ", err)
    });
  }

  saveAuthorizationCode(code, client, user) {
    return this.OauthAuthorizationCodes
        .upsert({
          expires: code.expiresAt,
          clientId: client.id,
          authorizationCode: code.authorizationCode,
          userId: user.id,
          scope: code.scope,
          redirectUri: code.redirectUri
        })
        .then(function () {
          code.code = code.authorizationCode;
          return code;
        }).catch(function (err) {
          console.log("saveAuthorizationCode - Err: ", err)
        });
  }

  revokeAuthorizationCode(code) {
    return this.OauthAuthorizationCodes.destroy({
      where: { authorizationCode: code }
    }).then(function (authorizationCode) {
      console.log(authorizationCode);
      return !!authorizationCode;
    }).catch(function (err) {
      console.log("get revokeAUthorizationCode - Err: ", err)
    });
  }
}

module.exports = new ServiceDB();