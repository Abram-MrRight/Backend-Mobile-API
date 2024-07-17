// config/db.config.js
module.exports = {
  HOST: 'localhost',
  USER: 'harry',
  PASSWORD: 'kaspastinski',
  DB: 'student_details',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

