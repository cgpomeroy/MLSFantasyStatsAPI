const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
Player = require('./api/models/playerModel'); //created model loading here
app = express();

const port = process.env.PORT || 3001;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;

//connect to my remote mongo instance
var uri = 'mongodb://colton:coltonpass@ds117848.mlab.com:17848/mls-stats';




mongoose.connect(uri, function(err){
        if(err){
            console.log("There was a connection error: ", err);
        }
        console.log("Connection was established.");
    }
);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const routes = require('./api/routes/playerRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log("Server's listening on Port", port);