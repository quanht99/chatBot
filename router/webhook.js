const express = require('express');
const router = express.Router();
const  request = require("request");
const VERIFY_TOKEN = "f34e8172d38f4001621b11f25c7dbe08";
const APP_SECRET = "af146db21aa912f1b36bbf7d21a9d306";
const PAGE_ACCESS_TOKEN = "EAAK9YsFwKooBAIu8u8zKsTZBL0ymo010UxgztHDhKmkez2ZBB7pkpYIM1Pe1V5r3vDPLsRuyatmAeTRRdZA8b2iuQtFKjeZBOpmnMHSoNclYn3j3x8u48DgMcgODZAONZBKv7MTB46CPEOOBsOl9jlZCBlTiSnPtWO4X0SZBNWu8MAZDZD";




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
    let entries = req.body.entry;
    for (let entry of entries) {
        let messaging = entry.messaging;
        for (let message of messaging) {
            let senderId = message.sender.id;
            console.log("id_user: ",message.sender.id);
            if (message.message) {
                if (message.message.text) {
                    let text = message.message.text;
                    console.log("message: ", text);
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