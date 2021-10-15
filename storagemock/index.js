var express = require("express");
var app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/applications/listing.json", async (req, res) => {
  const url = `${process.env.API_URL}/applications`;
  console.log(url);
  const resp = await fetch(url);
  const data = await resp.json();
  res.send(data);
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
