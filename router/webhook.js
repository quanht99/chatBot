const express = require('express');
const router = express.Router();
const VERIFY_TOKEN = "f34e8172d38f4001621b11f25c7dbe08";
const APP_SECRET = "af146db21aa912f1b36bbf7d21a9d306";
const PAGE_ACCESS_TOKEN = "EAAfBIGSlNtgBABPJ3I7Tuvi2yndxxI57LlQ95oswci7K5p1MVUWZBRzkVhkZB3Qct47t2P9263kvE88teyUWnOv5IZB4ICYcNWZChiBTNFSmWt4XsHsv0QS1CgWWutBtjRg2srTYyjmDAbbEpG4bCcHZCLxHjQ9N8Pnp1wt9OrQZDZD";

router.get('/webhook', (req, res) => {

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    console.log("mode: \n", mode);
    console.log("token: \n", token);
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for our webhook
router.post('/webhook', (req, res) => {
    var entries = req.body.entry;
    for (var entry of entries) {
        console.log(entry);
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            if (message.message) {
                if (message.message.text) {
                    var text = message.message.text;
                    sendMessage(senderId, "Hello!! I'm a bot. Your message: " + text);
                }
            }
        }
    }
    res.status(200).send("OK");
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