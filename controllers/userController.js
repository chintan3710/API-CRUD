const User = require("../models/User");

const path = require("path");

const fs = require("fs");

const bcrypt = require("bcrypt");

const jwtData = require("jsonwebtoken");

module.exports.insertData = async (req, res) => {
    try {
        let imagePath = "";
        if (req.body) {
            let checkMail = await User.findOne({ email: req.body.email });
            if (!checkMail) {
                if (req.file) {
                    imagePath = User.userModelPath + "/" + req.file.filename;
                    req.body.userImage = imagePath;
                    req.body.password = await bcrypt.hash(
                        req.body.password,
                        10
                    );
                    let userData = await User.create(req.body);
                    if (userData) {
                        return res.status(200).json({
                            msg: "User register successfully",
                            data: userData,
                            status: 1,
                        });
                    } else {
                        return res
                            .status(200)
                            .json({ msg: "User not register", status: 0 });
                    }
                } else {
                    return res
                        .status(200)
                        .json({ msg: "Image not found", status: 0 });
                }
            } else {
                return res
                    .status(200)
                    .json({ msg: "Email alredy register", status: 0 });
            }
        } else {
            return res.status(200).json({ msg: "Invalid data", status: 0 });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.viewAllData = async (req, res) => {
    try {
        let userData = await User.find({});
        if (userData) {
            return res
                .status(200)
                .json({ msg: "Here is all data", data: userData, status: 1 });
        } else {
            return res.status(200).json({ msg: "Data not found", status: 0 });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.editData = async (req, res) => {
    try {
        if (req.query) {
            let userData = await User.findById(req.query.id);
            if (userData) {
                let oldData = await User.findById(req.query.id);
                if (req.file) {
                    if (oldData.userImage) {
                        let fullPath = path.join(
                            __dirname,
                            ".." + oldData.userImage
                        );
                        await fs.unlinkSync(fullPath);
                    }
                    let imagePath = "";
                    imagePath = User.userModelPath + "/" + req.file.filename;
                    req.body.userImage = imagePath;
                } else {
                    req.body.userImage = oldData.userImage;
                }
                let editData = await User.findByIdAndUpdate(
                    req.query.id,
                    req.body
                );
                if (editData) {
                    let newData = await User.findById(req.query.id);
                    return res.status(200).json({
                        msg: "Data updated successfully",
                        data: newData,
                        status: 1,
                    });
                } else {
                    return res
                        .status(200)
                        .json({ msg: "Data not update", status: 0 });
                }
            } else {
                return res
                    .status(200)
                    .json({ msg: "User not found", status: 0 });
            }
        } else {
            return res.status(200).json({ msg: "Invalid params", status: 0 });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.deleteData = async (req, res) => {
    try {
        if (req.query) {
            let userData = await User.findById(req.query.id);
            if (userData) {
                if (userData.userImage) {
                    let fullPath = path.join(
                        __dirname,
                        ".." + userData.userImage
                    );
                    await fs.unlinkSync(fullPath);
                    let deleteData = await User.findByIdAndDelete(req.query.id);
                    if (deleteData) {
                        return res.status(200).json({
                            msg: "Data deleted succesffully",
                            data: deleteData,
                            status: 1,
                        });
                    } else {
                        return res
                            .status(200)
                            .json({ msg: "Data not deleted", status: 0 });
                    }
                } else {
                    return res
                        .status(200)
                        .json({ msg: "Image not found", status: 0 });
                }
            } else {
                return res
                    .status(200)
                    .json({ msg: "Data not found", status: 0 });
            }
        } else {
            return res.status(200).json({ msg: "Invalid params", status: 0 });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        if (req.body) {
            let checkmail = await User.findOne({ email: req.body.email });
            if (checkmail) {
                if (await bcrypt.compare(req.body.password, checkmail.password)) {
                    let token = jwtData.sign(
                        { userData: checkmail },
                        "JWTCRUD",
                        { expiresIn: "1h" }
                    );
                    return res
                        .status(200)
                        .json({
                            msg: "Login successfully",
                            loginToken: token,
                            status: 1,
                        });
                } else {
                    return res
                        .status(200)
                        .json({ msg: "Invalid password", status: 0 });
                }
            } else {
                return res
                    .status(200)
                    .json({ msg: "Email not match", status: 0 });
            }
        } else {
            return res.status(200).json({ msg: "Invalid data", status: 0 });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "Something went wrong", status: 0 });
    }
};
