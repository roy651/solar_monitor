var app = require("./app");
const cron = require("node-cron");

// At every minute
cron.schedule(`* * * * *`, async () => {
  // At minute 0 past every 2nd hour from 10 through 16 (GMT+2).
  // cron.schedule(`0 8-14/2 * * *`, async () => {
  console.log(`running daily...`);
  app.runDaily();
  console.log(`daily ended.`);
});

// this is just to satisfy the back4app requirement for a server...
const express = require("express");
const app = express();
const port = 5432;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
