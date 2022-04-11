var express = require("express");
var app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/*", async (req, res) => {
  if (process.env.USE_GITHUB_STORAGE !== "True") {
    if (req.url.endsWith("listing.json")) {
      const resp = await fetch(`http://api/applications`);
      const data = await resp.json();
      res.send(data);
      return;
    }
    res.status(404).send();
    return;
  }
  const url = `https://api.github.com/repos/${process.env.GITHUB_ORG}/${
    process.env.GITHUB_REPO
  }/contents/${req.url.replace("/applications/", "")}`;
  console.log(url);
  const resp = await fetch(url, {
    headers: {
      accept: "application/vnd.github.VERSION.raw",
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });
  const data = await resp.text();
  res.status(resp.status).send(data);
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
