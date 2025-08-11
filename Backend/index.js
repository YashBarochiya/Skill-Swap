const express = require("express");
const db = require("./config/dbconnection");
require("dotenv").config();
const app = express();
app.use(express.json());


app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.listen(process.env.PORT);
