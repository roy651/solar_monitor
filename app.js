const request = require('request');
const nodemailer = require('nodemailer');

var api_key  = process.env.SOLAR_API_KEY;
var mailPass  = process.env.GMAIL_PASSWORD;
const url = 'https://monitoringapi.solaredge.com/site/30221/timeFrameEnergy'
var today = new Date().toISOString().slice(0,10); // Today!
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1)
yesterday = yesterday.toISOString().slice(0,10); // Yesterday!
var fullUrl = url + '?startDate=' + yesterday + '&endDate=' + today + '&api_key=' + api_key;

request(fullUrl , { json: true }, (err, res, body) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log(body.timeFrameEnergy.energy);
  if (parseFloat(body.timeFrameEnergy.energy) < 20) {
    sendAlert(body.timeFrameEnergy.energy);
  }
});


function sendAlert(value) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'avigail.roy@gmail.com',
      pass: mailPass
    }
  });

  var mailOptions = {
    from: 'avigail.roy@gmail.com',
    to: 'roy.abitbol@gmail.com',
    subject: 'Alert for solar system: ' + value,
    text: 'Production for last 2 days was below 20 KW. Standing at: ' + value
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}