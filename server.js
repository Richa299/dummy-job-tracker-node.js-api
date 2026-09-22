const jobs = [
  { id: 1, title: "React Developer", company: "Adobe" },
  { id: 2, title: "Frontend Developer", company: "Infosys" },
];
const http = require("http");
const server = http.createServer((req, res) => {
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

  let parts = [];
  let id = 0;

  if (req.method == "GET" && req.url == "/jobs") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(jobs));
  } else if (req.method == "POST" && req.url == "/jobs") {
    let body = "";
    req.on("data", (chunk) => {
      body = body + chunk.toString();
    });
    req.on("end", () => {
      const job = JSON.parse(body);
      job.id = jobs.length + 1;
      jobs.push(job);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(job));
    });
  } else if (req.method === "GET" && req.url.startsWith("/jobs/")) {
    parts = req.url.split("/");
    id = Number(parts[parts.length - 1]);
    let job = jobs.find((item) => item.id === id);
    if (!job) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "Job not found",
        }),
      );
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(job));
    }
  } else if (req.method === "DELETE" && req.url.startsWith("/jobs/")) {
    parts = req.url.split("/");
    id = Number(parts[parts.length - 1]);
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
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "Job deleted successfully" }));
    }
  } else if (req.method === "PUT" && req.url.startsWith("/jobs/")) {
    parts = req.url.split("/");
    id = Number(parts[parts.length - 1]);
    const index = jobs.findIndex((item) => item.id === id);

    if (index === -1) {
      res.statusCode = 404;
      res.end("Job not found");
      return;
    } else {
      let body = "";
      req.on("data", (chunk) => {
        body = body + chunk.toString();
      });
      req.on("end", () => {
        let updatedjob = JSON.parse(body);
        jobs[index] = { id: id, ...updatedjob };
      });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(jobs[index]));
    }
  } else {
    res.statusCode = 400;
    res.end("route not found");
  }
});
server.listen(3000);
