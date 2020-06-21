const base64 = require("base-64");

function DecToken(token) {
  const tok = token.split(".");
  var jsonPayload = base64.decode(tok[1]);
  return JSON.parse(jsonPayload);
}

module.exports = {
  DecToken,
};
