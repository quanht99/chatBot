const express = require('express');
const router = express.Router();
const VERIFY_TOKEN = "f34e8172d38f4001621b11f25c7dbe08";
const APP_SECRET = "af146db21aa912f1b36bbf7d21a9d306";
const PAGE_ACCESS_TOKEN = "EAAFvhxfFehoBAE6W5ZBQKanfeRvDIs9XZA3DfCPTwgZBeuURfL6K92bwvEDu4rYz1osTR5ZC0lZAQu6nMvyIfzmPTvQsCHqMefoZAzz4MMZAHLv04GMDFKwi0ioD5THFQ3z2DJJ3Au6ZCnpzYMBAvCCZBXVqyCrjhj3EA3SbhoACxYQZDZD";

router.get('/webhook', (req, res) => {
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

        if (token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
});

// Creates the endpoint for our webhook
router.post('/webhook', (req, res) => {

    // Parse the request body from the POST
    let body = req.body;
    console.log(req.body);

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry[0].changes.forEach(function(entry) {

            // Gets the body of the webhook event
            let webhook_event = entry.value;
            console.log(webhook_event);
        });

        // Return a '200 OK' response to all events
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

    });

function sendMessage(senderId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: PAGE_ACCESS_TOKEN,
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text: message
            },
        }
    });
}

module.exports = router;