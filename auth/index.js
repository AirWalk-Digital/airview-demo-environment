var express = require("express");
var jwt = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");
var app = express();

app.get("/validate", async (req, res) => {
  let token = "";
  const authHeader = req.headers.authorization;
  if ((authHeader || "").startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  }
  const options = {
    audience: process.env.TOKEN_AUDIENCE,
    issuer: process.env.TOKEN_ISSUER,
  };

  var client = jwksClient({
    jwksUri: process.env.TOKEN_KEYS_URI,
  });
  function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
      if (err) {
        callback(err, null);
        return;
      }
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  jwt.verify(token, getKey, options, function (err, decoded) {
    if (err) {
      console.log(err);
      res.status(401).send();
    } else {
      res.status(200).send("ok");
    }
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
