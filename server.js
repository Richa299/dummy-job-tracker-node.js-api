const fs = require("fs");

const http = require("http");
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

function getJobs(req, res) {
  fs.readFile("jobs.json", "utf-8", (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          message: "file not found",
        }),
      );
      return;
    }
    const jobs = JSON.parse(data);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(jobs));
  });
}
function postJobs(req, res) {
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  req.on("end", () => {
    fs.readFile("jobs.json", "utf-8", (err, data) => {
      const jobs = JSON.parse(data);

      const job = JSON.parse(body);
      job.id = jobs.length + 1;
      jobs.push(job);
      fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
        if (err) {
          ((res.statusCode = 500),
            res.end(JSON.stringify({ message: "Error saving job" })));
          return;
        }
        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(job));
      });
    });
  });
}
function putJobs(req, res) {
  let parts = [];
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk.toString();
  });
  parts = req.url.split("/");
  id = Number(parts[parts.length - 1]);
  req.on("end", () => {
    fs.readFile("jobs.json", "utf-8", (err, data) => {
      const jobs = JSON.parse(data);

      const index = jobs.findIndex((item) => item.id === id);

      if (index === -1) {
        res.statusCode = 404;
        res.end("Job not found");
        return;
      } else {
        let updatedjob = JSON.parse(body);
        jobs[index] = { id: id, ...updatedjob };
        fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
          if (err) {
            res.statusCode = 500;
            res.end("Error while updating the job");
            return;
          }
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(jobs[index]));
        });
      }
    });
  });
}
function deleteJobs(req, res) {
  parts = req.url.split("/");
  id = Number(parts[parts.length - 1]);
  fs.readFile("jobs.json", "utf-8", (err, data) => {
    if (err) {
      return;
    }
    const jobs = JSON.parse(data);

    let index = jobs.findIndex((item) => item.id === id);
    jobs.splice(index, 1);
    if (index === -1) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Job not found",
        }),
      );
    } else {
      fs.writeFile("jobs.json", JSON.stringify(jobs), (err) => {
        if (err) {
          req.statusCode = 500;
          res.end("Error in deleting the job");
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify({ message: "Job deleted successfully" }));
      });
    }
  });
}
