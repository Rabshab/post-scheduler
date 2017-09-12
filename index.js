console.log('running');

require('dotenv').config();
const CronJob = require('cron').CronJob;
const people = require('./people');
const moment = require('moment');
const Twilio = require('Twilio');


new CronJob('00 20 23 * * *', sendNotifications, null, true, 'Europe/London');

function sendNotifications() {
        const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const todaysPoster = '4';
        // Create options to send the message
        const options = {
                to: `+${people.todaysPoster.phoneNumber}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                body: `Hi ${people.todaysPoster.name}. It's your turn to post today`,
            };

            // Send the message
            client.messages.create(options, function(err, response) {
                if (err) {
                    console.error(err);
                } else {
                    let masked = appointment.phoneNumber.substr(0,
                        appointment.phoneNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        };