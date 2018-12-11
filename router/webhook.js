const express = require('express');
const router = express.Router();
const VERIFY_TOKEN = "f34e8172d38f4001621b11f25c7dbe08";
const APP_SECRET = "af146db21aa912f1b36bbf7d21a9d306";
const PAGE_ACCESS_TOKEN = "EAAK9YsFwKooBAIu8u8zKsTZBL0ymo010UxgztHDhKmkez2ZBB7pkpYIM1Pe1V5r3vDPLsRuyatmAeTRRdZA8b2iuQtFKjeZBOpmnMHSoNclYn3j3x8u48DgMcgODZAONZBKv7MTB46CPEOOBsOl9jlZCBlTiSnPtWO4X0SZBNWu8MAZDZD";
var request = require("request");



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

router.post('/webhook', function(req, res) {
    var entries = req.body.entry;
    for (var entry of entries) {
        var messaging = entry.messaging;
        for (var message of messaging) {
            var senderId = message.sender.id;
            console.log(message.sender.id);
            if (message.message) {
                // If user send text
                if (message.message.text) {
                    var text = message.message.text;
                    console.log(text); // In tin nhắn người dùng
                    sendMessage(senderId, "Tui là bot đây: " + text);
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