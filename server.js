const http = require("http");
const { getJobs, postJobs, putJobs, deleteJobs } = require("./jobs");

const server = http.createServer((req, res) => {
  // Handle CORS error
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method == "GET" && req.url == "/jobs") {
    getJobs(req, res);
  } else if (req.method == "POST" && req.url == "/jobs") {
    postJobs(req, res);
  } else if (req.method === "DELETE" && req.url.startsWith("/jobs/")) {
    deleteJobs(req, res);
  } else if (req.method === "PUT" && req.url.startsWith("/jobs/")) {
    putJobs(req, res);
  } else {
    res.statusCode = 400;
    res.end("route not found");
  }
});
server.listen(3000);
