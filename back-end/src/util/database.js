const Sequelize = require("sequelize");

const seq = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
    // define: {
    //   timestamps: false,
    // },
  }
);

module.exports = seq;
