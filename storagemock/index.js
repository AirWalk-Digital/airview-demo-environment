var express = require("express");
var app = express();

let map = {};

const rawfetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const fetch = async (url) => {
  const cached = map[url];

  const options = {
    headers: {
      accept: "application/vnd.github.VERSION.raw",
      authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  };

  if (cached) {
    options.headers["If-None-Match"] = cached.etag;
  }

  const response = await rawfetch(url, options);

  if (response.status === 304) {
    return cached;
  }

  const data = await response.blob();
  if (response.ok) {
    const etag = response.headers.get("ETag");
    if (etag) {
      map[url] = { status: response.status, data, etag };
    }
  }
  return { status: response.status, data };
};

app.get("/*", async (req, res) => {
  if (process.env.USE_GITHUB_STORAGE !== "True") {
    if (req.url.endsWith("listing.json")) {
      const resp = await rawfetch(`http://api/applications`);
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
  const resp = await fetch(url);
  // res.type(resp.data.type);
  resp.data.arrayBuffer().then((buf) => {
    res.status(resp.status).send(Buffer.from(buf));
  });
  // res.status(resp.status).send(data);
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
