const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../model/User');
const dbConfig = require('../config/secret');
const jwt = require('jsonwebtoken');


app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    console.log("het")
    res.status(200).render("login");
})

router.post("/", async (req, res, next) => {

    var payload = req.body;

    if(req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { email: req.body.logUsername }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).json({result:payload.errorMessage});
        });
        
        if(user != null) {
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true) {
                const token = jwt.sign({ data: user }, dbConfig.secret, {
                    expiresIn: '5h'
                  });
                return res.status(200).json({ message: 'Welcome', user, token });
            }
        }

        payload.errorMessage = "Login credentials incorrect.";
        return res.status(200).json({result:payload.errorMessage});
    }

    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).json({result:payload.errorMessage});
})

module.exports = router;