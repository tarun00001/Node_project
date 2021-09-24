const express = require('express');
const cors = require('cors');
// const bodyParser = require("body-parser");
const user = require("./routes/user");
const InitiateMongoServer = require("./config/db");
require('dotenv') //.config({path: './.env'});
const app = express();

// Initiate Mongo Server
InitiateMongoServer();

// PORT
const PORT=process.env.PORT || 8080;

app.use(cors());

app.use(express.json())
app.get('/', function(req, res){
    res.send("hello world")
})

app.use("/api/v1/users", user);

app.listen(PORT,() => {
    console.log(`App listening at http://localhost:${PORT}`)
})