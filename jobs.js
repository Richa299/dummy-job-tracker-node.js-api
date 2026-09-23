const fs = require("fs");

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
    const job = JSON.parse(body);
    fs.readFile("jobs.json", "utf-8", (err, data) => {
      const jobs = JSON.parse(data);

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
    let updatedjob = JSON.parse(body);
    fs.readFile("jobs.json", "utf-8", (err, data) => {
      const jobs = JSON.parse(data);

      const index = jobs.findIndex((item) => item.id === id);

      if (index === -1) {
        res.statusCode = 404;
        res.end("Job not found");
        return;
      } else {
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
module.exports = {
  getJobs,
  postJobs,
  putJobs,
  deleteJobs,
};
