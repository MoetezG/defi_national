const route = require("express").Router();

const { loginUser, RegisterUser } = require("../controller/login");

route.post("/login", loginUser);

module.exports = route;
