const dbConfig = process.env.DB_URL;

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig;
db.trainees = require("./trainee")(mongoose);

console.log(typeof db.url);


module.exports = db;