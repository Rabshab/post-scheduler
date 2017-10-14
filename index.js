
require('dotenv').config();
var CronJob = require('cron').CronJob;
var people = require('./people');
var moment = require('moment');
var Twilio = require('Twilio');
var fs = require('fs');
console.log('-------------running-------------');

new CronJob('* * * * * *', notify, null, true, 'Europe/London');

function sendNotification(personId) {
    var client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    var options = {
            to: `+${people[personId].phoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: `Hi ${people[personId].name}. It's your turn to post today`,
        };

        client.messages.create(options, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                var masked = appointment.phoneNumber.substr(0,
                    appointment.phoneNumber.length - 5);
                masked += '*****';
                console.log(`Message sent to ${masked}`);
            }
        });
    };

function notify() {
    let personId = parseInt(fs.readFileSync('personId.txt','utf8'));
    sendNotification(personId)

    if ( personId > 7) personId = 0;
    else personId+=1;

    fs.writeFile('test.txt', personId, (err) => {
        if (err) throw err;
      });
}