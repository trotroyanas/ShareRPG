const { Ret } = require("../models/classes.js");
const cnx = require("./CnxBDD.js");

const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const jwtpwd = require("../config/jwt.json");

// Check email //

exports.Upload = async (req, res) => {
  try {
    console.log("coucou les amis.");
  } catch (err) {
    const Retour = new Ret(1, err.message);
    console.log(Retour);
    res.status(500).send(Retour);
  }
};
