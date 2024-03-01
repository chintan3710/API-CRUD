const express = require("express");

const Passport = require("passport");

const userController = require("../controllers/userController");

const User = require("../models/User");

const routes = express.Router();

routes.post("/insertData", User.uploadedImage, userController.insertData);

routes.get(
    "/viewAllData",
    Passport.authenticate("userLogin", { failureRedirect: "/failLogin" }),
    userController.viewAllData
);

routes.put("/editData", User.uploadedImage, userController.editData);

routes.delete("/deleteData", userController.deleteData);

routes.post("/loginUser", userController.loginUser);

routes.get("/failLogin", (req, res) => {
    return res
        .status(400)
        .json({ msg: "Invalid username or password", status: 0 });
});

module.exports = routes;
