const Passport = require("passport");

const jwtStrategy = require("passport-jwt").Strategy;

const jwtExtract = require("passport-jwt").ExtractJwt;

const User = require("../models/User");

let userOpts = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey: "JWTCRUD",
};

Passport.use(
    "userLogin",
    new jwtStrategy(userOpts, async (record, done) => {
        let data = await User.findById(record.userData._id);
        data ? done(null, data) : done(null, false);
    })
);

Passport.serializeUser((user, done) => {
    return done(null, user.id);
});

Passport.deserializeUser(async (id, done) => {
    let reCheck = await User.findById(id);
    reCheck ? done(null, reCheck) : done(null, false);
});
