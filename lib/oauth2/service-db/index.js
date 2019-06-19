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
      console.log("##############getUser##################");

      return Object.assign({}, dataValues);
    }).catch(e => console.log(e));
  }

  saveToken(token, client, user) {
    console.log("##############saveToken##################");

    return this.OauthTokens.upsert({
      accessToken: token.accessToken,
      tokenExpires: new Date(token.accessTokenExpiresAt).toLocaleString(),
      clientIdx: client.idx,
      userIdx: user.idx,
      scope: client.scope,
      refreshToken: token.refreshToken,
      refreshTokenExpires: new Date(token.refreshTokenExpiresAt).toLocaleString(),
    }).then(() => {
      /*
      return Object.assign({}, {
        client: {},
        user: {},
        accessToken: token.accessToken,
        expiresIn: Math.floor(new Date(token.accessTokenExpiresAt) / 1000),
        refreshToken: token.refreshToken,
        scope: user.scope
      });
      */
   
     return Object.assign({}, {
        client: {},
        user: {},
        accessToken: token.accessToken,
        expiresIn: Math.floor(new Date(token.accessTokenExpiresAt) / 1000),
        refreshToken: token.refreshToken,
        scope: user.scope
     });;
      
     
    }).catch(e => {
      console.log(e);
    });
  }

  getAccessToken(bearerToken) {
    console.log("##############getAccessToken##################");
    return this.OauthTokens.findOne({
      where: {accessToken: bearerToken},
      include: [ {model:this.OauthClients}, {model: this.User} ]
    }).then((accessToken) => {
      if (!accessToken) return false;
      const token = accessToken.toJSON();
      token.user = token.User;
      token.client = token.OauthClient;
      token.scope = token.scope;
      token.accessTokenExpiresAt = new Date(token.tokenExpires);
      return token;
    }).catch((err) => {
      console.log("getAccessToken - Err: ", err);
    });
  }


  getAuthorizationCode(code) {
    console.log("##############getAuthroizationCode##################");
    return this.OauthAuthorizationCodes.findOne({
      where: { authorizationCode: code },
      include: [ {model:this.OauthClients}, {model: this.User} ]
    }).then((authCodeModel) => {
      console.log(authCodeModel);
      const {dataValues, OauthClient, User} = authCodeModel;
      if(!dataValues || !OauthClient || !User) return false;
      const client = OauthClient.dataValues;
      const user = User.dataValues;
      console.log('야 봐라 날짜'+dataValues.expires);
      console.log('야 봐라 날짜2'+new Date(dataValues.expires).toString());
      return {
        code,
        client,
        expiresAt: new Date(dataValues.expires+16 * 60 * 60),
        redirectUri: client.redirectUris,
        user,
        scope: dataValues.scope
      };

    }).catch(function (err) {
      console.log("getAuthorizationCode - Err: ", err)
    });
  }

  saveAuthorizationCode(code, client, user) {
    console.log(new Date(code.expiresAt).toLocaleString());
    return this.OauthAuthorizationCodes
        .upsert({
          expires: new Date(code.expiresAt).toLocaleString(),
          clientIdx: client.idx,
          authorizationCode: code.authorizationCode,
          userIdx: user.idx,
          scope: user.scope,
          redirectUri: code.redirectUri
        })
        .then(function () {
          const {authorizationCode, redirectUri} = code;
          return {
            authorizationCode,
            redirectUri
          };
        }).catch(function (err) {
          console.log("saveAuthorizationCode - Err: ", err)
        });
  }

  revokeAuthorizationCode(code) {
    return this.OauthAuthorizationCodes.destroy({
      where: { authorizationCode: code }
    }).then(function (authorizationCode) {
      return !!authorizationCode;
    }).catch(function (err) {
      console.log("get revokeAUthorizationCode - Err: ", err)
    });
  }

  getRefreshToken(refreshToken) {
    console.log("##############getRefreshToken##################");
    if(!refreshToken) return false;

    return this.OauthTokens.findOne({
      where: { refreshToken },
      include: [ {model:this.OauthClients}, {model: this.User} ]
    }).then(function (savedRefreshToken) {
      const {dataValues, OauthClient, User} = savedRefreshToken;
      if(!dataValues || !OauthClient || !User) return false;
      const client = OauthClient.dataValues;
      const user = User.dataValues;

      return {
        user: savedRefreshToken ? user : {},
        client: savedRefreshToken ? client : {},
        refreshTokenExpiresAt: new Date(savedRefreshToken.refreshTokenExpires),
        refreshToken: refreshToken,
        refresh_token: refreshToken,
        scope: dataValues.scope
      };
    }).catch(function (err) {
      console.log("getRefreshToken - Err: ", err)
    });
  }

  revokeToken({refreshToken}) {
    return this.OauthTokens.destroy({
      where: {refreshToken}
    }).then(function (refreshToken) {
      return !!refreshToken;
    }).catch(function (err) {
      console.log("revoke refreshToken - Err: ", err)
    });
  }

  async user(username, password) {
    const option = {
      where: {userName: username, password}
    };
    return await this.User.findOne(option);
  }
}

module.exports = new ServiceDB();