let Retour = require("../models/retour.json");
const jwt = require("jsonwebtoken");
const jwtpwd = require("../config/jwt.json");

Retour.status = 1;
Retour.detail = "Invalid Token";

exports.auth = function (req, res, next) {
  const token = req.header("Authorization").substring(7);
  if (!token) return res.status(401).send(Retour);
  try {
    const verified = jwt.verify(token, jwtpwd.secret);
    req.user = verified;
    next();
  } catch (error) {
    Retour.status = 1;
    Retour.detail = "token error, obsolete or empty";
    res.status(401).send(Retour);
  }
};
