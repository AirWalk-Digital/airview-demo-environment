var CryptoJS = require("crypto-js");
var express = require("express");
var app = express();

/* const host = "http://localhost:8080"; */

function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);

  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, "");

  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, "-");
  encodedSource = encodedSource.replace(/\//g, "_");

  return encodedSource;
}
function createToken(host) {
  var header = {
    alg: "HS256",
    typ: "JWT",
  };

  var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
  var encodedHeader = base64url(stringifiedHeader);

  const seconds = new Date() / 1000;
  const expiry = seconds + 90; //+ 86400;
  var data = {
    nbf: seconds,
    iss: `${host}/default`,
    exp: expiry,
    iat: seconds,
  };

  var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  var encodedData = base64url(stringifiedData);

  var token = encodedHeader + "." + encodedData;
  return { token, expiry: expiry - seconds };
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/default/.well-known/openid-configuration", function (req, res) {
  const host = `http://${req.headers.host}`;
  const config = {
    issuer: `${host}/default`,
    authorization_endpoint: `${host}/default/authorize`,
    end_session_endpoint: `${host}/default/endsession`,
    token_endpoint: `${host}/default/token`,
    jwks_uri: `${host}/default/jwks`,
    response_types_supported: ["query", "fragment", "form_post"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
  };
  res.send(config);
});

app.get("/default/authorize", function (req, res) {
  res.redirect(
    `${req.query.redirect_uri}?code=somerandomstring&state=${req.query.state}`
  );
  //
});
app.post("/default/token", function (req, res) {
  const host = `http://${req.headers.host}`;
  const { token, expiry } = createToken(host);
  const data = {
    token_type: "Bearer",
    access_token: token,
    refresh_token: "random_refresh_token",
    expires_in: expiry,
  };
  res.send(data);
});
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
