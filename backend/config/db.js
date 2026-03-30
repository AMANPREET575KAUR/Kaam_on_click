const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "kaam_on_click",
  "root",
  "Apoorva@1",
  {
    host: "localhost",
    dialect: "mysql",
    logging: false
  }
);

module.exports = sequelize;