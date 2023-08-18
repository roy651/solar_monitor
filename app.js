const request = require("axios");
const nodemailer = require("nodemailer");
require("dotenv").config();

var api_key = process.env.SOLAR_API_KEY;
var mailPass = process.env.GMAIL_PASS;
var threshold = process.env.SOLAR_THRESHOLD;
if (threshold && threshold != "") {
  threshold = parseInt(threshold);
} else {
  threshold = 1000;
}
const url = "https://monitoringapi.solaredge.com/site/30221/timeFrameEnergy";
var today = new Date().toISOString().slice(0, 10); // Today!
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
var tommorrow = new Date();
tommorrow.setDate(yesterday.getDate() + 2);
yesterday = yesterday.toISOString().slice(0, 10); // Yesterday!
tommorrow = tommorrow.toISOString().slice(0, 10); // Tommorrow!
var fullUrl = url + "?startDate=" + yesterday + "&endDate=" + today + "&api_key=" + api_key;
// If we use this next option of query (instead of the previous line)
// Then this should probably not run too early in the day - pending on the threshold
// as it might yield false alerts

var runDaily = function run() {
  fullUrl = url + "?startDate=" + today + "&endDate=" + tommorrow + "&api_key=" + api_key;
  console.log(fullUrl);
  try {
    request({
      method: "get",
      url: fullUrl,
      responseType: "json",
    })
      .then(function (res) {
        var body = res.data;
        console.log(body);
        if (parseFloat(body.timeFrameEnergy.energy) < threshold) {
          sendAlert(body.timeFrameEnergy.energy);
        }
      })
      .catch(function (error) {
        console.log(err);
        process.exit(1);
      })
      .finally(function () {
        // always executed
      });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  //   request.get(fullUrl, { json: true }, (err, res, body) => {
  //     try {
  //       if (err) {
  //         console.log(err);
  //         process.exit(1);
  //       }
  //       if (body.validationErrors) {
  //         console.log(body.validationErrors.validationError[0].message);
  //         process.exit(1);
  //       }
  //       console.log(body);
  //       if (parseFloat(body.timeFrameEnergy.energy) < threshold) {
  //         sendAlert(body.timeFrameEnergy.energy);
  //       }
  //       // process.exit(0);
  //     } catch (err) {
  //       console.log(err);
  //       process.exit(1);
  //     }
  //   });
};

function sendAlert(value) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "avigail.roy@gmail.com",
      pass: mailPass,
    },
  });

  var mailOptions = {
    from: "avigail.roy@gmail.com",
    to: "roy.abitbol@gmail.com",
    subject: "Alert for solar system: " + value,
    text: "Production for last 2 days was below 20 KW. Standing at: " + value,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      process.exit(1);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

runDaily();

module.exports.runDaily = runDaily;
