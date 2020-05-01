const express = require("express")
const User = require("../models/user");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require('joi')
const validator = require('express-joi-validation').createValidator({statusCode: 422})

const loginQuerySchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

// /auth/signup endpoint
authRouter.post("/signup", validator.body(loginQuerySchema),
    (req, res, next) => {
        User.findOne({ username: req.body.username }, (error, existingUser) => {
            if (error) {
                res.status(500);
                return next(error);
            } 
            // Validate if the username is already used
            else if (existingUser !== null) {
                res.status(400);
                return res.send("That username already exists!");
            }
            // if no user has the same username, save the new user
            const newUser = new User(req.body);
            newUser.save((err, user) => {
                // error handling
                if (err) return res.status(500).send({success: false, err});
                // create JWT token from the user document and return it
                // to the client for further request to protected endpoints
                const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
                return res.status(201).send({ user: user.withoutPassword(), token });
            });
        });
});

authRouter.post("/login", validator.body(loginQuerySchema),
    (req, res, next) => {
    User.findOne({ username: req.body.username.toLowerCase() }, (error, user) => {
        if (error) {
            res.status(500);
            return next(error);
        } else if (!user) {
            res.status(403);
            return res.send("Username or password are incorrect");
        }
        user.checkPassword(req.body.password, (err, match) => {
            if (err) return res.status(500).send(err);
            if (!match) return res.status(401).send({ message: "Username or password are incorrect" });
            const token = jwt.sign(user.withoutPassword(), process.env.SECRET);
            return res.status(201).send({ user: user.withoutPassword(), token });
        });
    });
})

module.exports = authRouter;