const express = require("express");

const route = express.Router();
const {signup, login} = require("../controllers/authcontroller");

route.post("/signup",signup);
route.post("/login",login);

module.exports = route;