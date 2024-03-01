const mongoose = require("mongoose");

const multer = require("multer");

const path = require("path");

const imagePath = "/uploads";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userImage: {
        type: String,
        required: true,
    },
});

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", imagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now());
    },
});

userSchema.statics.uploadedImage = multer({ storage: imageStorage }).single(
    "userImage"
);

userSchema.statics.userModelPath = imagePath;

const User = mongoose.model("User", userSchema);

module.exports = User;
