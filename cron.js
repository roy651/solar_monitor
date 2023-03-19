var app = require("./app");
import cron from "node-cron";

// every day at 10AM
// cron.schedule(`0 10 * * */1`, async () => {
// every minute
cron.schedule(`* * * * */1`, async () => {
  console.log(`running daily...`);
  app.runDaily();
  console.log(`daily ended.`);
});
