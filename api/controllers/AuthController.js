const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const UserModel = require("../model/UserModel");
apiResponse = require('../utils/ApiResponse.js');

module.exports = {
    register: async(req, res, next) => {
        try {
            const emailExist = await UserModel.find({ email: req.body.email });
            if (emailExist && emailExist.length) {
                res
                .status(401)
                .send(
                    new apiResponse.responseObject(401, 'Email already exists' , null).getResObject()
                )
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const user = new UserModel({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: hashedPassword
            })
            const saveUser = await UserModel.create(user);
            res
            .status(200)
            .send(
                new apiResponse.responseObject(200, 'Email created successfully' , null).getResObject()
            )
        } catch(err) {
            return res // throwing error response to the client
            .status(500)
            .send(new apiResponse.responseObject(500, null, err).getResObject());
        }
    },

    signin: async(req, res) => {
        try {
            // const loginSchema = Joi.object({
            //     email: Joi.string().min(6).required().email(),
            //     password: Joi.string().min(8).required(),
            // })
            const user = await UserModel.findOne({ email: req.body.email });

            if (!user) 
            return res // throwing error response to the client
            .status(404)
            .send(new apiResponse.responseObject(404, 'Email not found', null).getResObject());

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) 
            return res // throwing error response to the client
            .status(404)
            .send(new apiResponse.responseObject(404, 'Incorrect Password', null).getResObject());

            const token = jwt.sign({ _id: user._id}, process.env.TOKEN_SECRET);
            res
            .status(200)
            // .header("auth-token", token)
            .send(
                new apiResponse.responseObject(200, token, null).getResObject()
            )
        } catch(err) {
            return res // throwing error response to the client
            .status(500)
            .send(new apiResponse.responseObject(500, null, err).getResObject());
        }
    }
}