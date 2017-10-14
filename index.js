require('dotenv').config();
var CronJob = require('cron').CronJob;
var people = require('./people');
var moment = require('moment');
var Twilio = require('Twilio');
var express = require('express');
var fs = require('fs');
const bodyParser = require('body-parser');

const MessagingResponse = Twilio.twiml.MessagingResponse;
const app = express();

app.use(bodyParser());

console.log('-------------running-------------');

new CronJob('00 30 19 * * *', notify, null, true, 'Europe/London');

app.post('/sms', function (req, res) {
    const twiml = new MessagingResponse();

    if (req.body.Body == 'skip') {
        incrementPersonId();
        notify();
    } else if(req.body.Body == 'feature') {
        feature();
    } else {
        twiml.message('Your response didnt match any of the accepted phrases');
    }

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})

function sendNotification(personId, body) {
    var client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    var options = {
            to: `+${people[personId].phoneNumber}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            body: body ? body : `Hi ${people[personId].name}. It's your turn to post today`,
        };

        client.messages.create(options, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                var masked = people[personId].phoneNumber.substr(0,
                    people[personId].phoneNumber.length - 5);
                masked += '*****';
                console.log(`Message sent to ${masked}`);
            }
        });
    };

function notify() {
    let personId = getPersonId();
    sendNotification(personId, null);
    incrementPersonId();
}

function getPersonId() {
    return parseInt(fs.readFileSync('personId.txt','utf8'));
}

function incrementPersonId() {
    var personId = getPersonId();
    if ( personId === 7) personId = 0;
    else personId++;

    fs.writeFileSync('personId.txt', personId, null);
}

function feature(){
    var body = "Someone has suggested we do a feature today. Anyone seen anything good"
    Object.keys(people).forEach(function(key){
        sendNotification(key, body)
    })
}