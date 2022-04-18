const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../model/User');
const Token = require('../schemas/TokenSchema');
const dbConfig = require('../config/secret');
const jwt = require('jsonwebtoken');
const sendmail = require('sendmail')();
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.get("/", (req, res, next) => {

   // res.status(200).render("register");
   console.log("hi")
   console.log("hey")
})

router.post("/", async (req, res, next) => {
    console.log("hi")

    var firstName = req.body.firstname.trim();
    var lastName = req.body.lastname.trim();
    var username = req.body.username.trim();
    var phonenumber = req.body.phonenumber.trim();
  
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;
   
    if(firstName && lastName && username && email && password && phonenumber) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).json({result:payload.errorMessage});
        });

        if(user == null) {
            // No user found
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            
            User.create(data)
            .then((user) => {
                const tokensd = jwt.sign({ data: user }, dbConfig.secret, {
                    expiresIn: '5h'
                  });
                  res.cookie('auth', tokensd);
                var token = new Token({ email: user.email, token: getRndInteger(0,10) });
                token.save(function (err) {
                    if(err){
                        payload.errorMessage = "Could not save.";
                      return res.status(500).send({msg:err.message});
                    }
                    sendmail({
                        from: 'dedolph2@gmail.com',
                        to: user.email,
                        subject: 'Account Verification Code',
                        html: 'Hello '+ req.body.firstName +',\n\n' + 'Please verify your account by entering the code: '+ token.token + '\n\nThank You!\n',
                      }, function(err, reply) {
                        console.log(err && err.stack);
                        console.dir(reply);
                        payload.errorMessage =reply;
                    });

                    res.json({result:'Verification Code Sent To Your Mail.Please Confirm',user,tokensd});
                });
               
               // console.log(data);
              //  return res.redirect("/");
               
            });
               
              
               
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already Taken.";
            }
            else {
                payload.errorMessage = "Username already Taken.";
            }
            res.status(200).json({result:payload.errorMessage});
        }
    }
    else {
        payload.errorMessage = "Please fill out all fields correctly.";
        res.status(200).json({result:payload.errorMessage});
    }
})
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (9999 - 1)) + 1000;
  }

module.exports = router;