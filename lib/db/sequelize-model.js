'use strict';

const fs = require('fs');
const path = require('path');

class SequelizeModel {
  constructor(modelDir, sequelize) {
    const db = {};

    fs.readdirSync(modelDir)
        .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
        .forEach(file => {
          const model = sequelize.import(path.join(modelDir, file));

          this[model.name] = model;
          db[model.name] = model;
        });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  }
}

module.exports = SequelizeModel;