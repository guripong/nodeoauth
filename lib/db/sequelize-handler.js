'use strict';

const config = require('../../config/develope');
const Sequelize = require('sequelize');

class SequelizeHandler {
  constructor() {
    this.oauth2 = new Sequelize(config.database, config.user, config.password, config.options);
  }
}

module.exports = new SequelizeHandler();