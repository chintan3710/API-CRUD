const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/API-CRUD");

const db = mongoose.connection;

db.once("open", (err) => {
    err
        ? console.log("DB not connected")
        : console.log("DB connected succesffully");
});

module.exports = db;
