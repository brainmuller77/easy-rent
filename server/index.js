const express = require('express');
const app = express();
const port = process.env.PORT || 3004;
const middleware = require('./middleware');
const cors = require('cors');



app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(cors);
app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//Route files
const userRoute = require('./routes/user.route')
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes');
const profileRoute = require('./routes/profileRoutes');
const auth = require('./routes/authRoutes');


app.get("/", (req, res) => {

   
console.log("hi");
    res.status(200).write("hi")


})


//app routes
app.use('/api', userRoute)
app.use('/login', loginRoute)
app.use("/register", registerRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use('/auth', auth);


app.use(function (error, res,) {
    console.error(error.message);
    if (!error.statusCode) error.statusCode = 500;
    res.status(error.statusCode).send(error.message);
  });