const Sequelize = require("sequelize");

require("dotenv").config();

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  Sequelize = new Sequelize(
    process.env.DBNAME,
    process.env.DBUSER,
    process.env.DBPW,
    {
      host: "localhost",
      dialect: "mysql",
      port: 3001,
    }
  );
}

module.exports = sequelize;