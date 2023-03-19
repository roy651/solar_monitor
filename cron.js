var app = require("./app");
const cron = require("node-cron");

// At every minute
// cron.schedule(`* * * * *`, async () => {

// At minute 0 past every 2nd hour from 10 through 16.
cron.schedule(`0 10-16/2 * * *`, async () => {
  console.log(`running daily...`);
  app.runDaily();
  console.log(`daily ended.`);
});
