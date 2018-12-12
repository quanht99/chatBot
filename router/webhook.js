const express = require('express');
const router = express.Router();
const  request = require("request");
const VERIFY_TOKEN = "f34e8172d38f4001621b11f25c7dbe08";
const APP_SECRET = "af146db21aa912f1b36bbf7d21a9d306";
const PAGE_ACCESS_TOKEN = "EAAK9YsFwKooBAIu8u8zKsTZBL0ymo010UxgztHDhKmkez2ZBB7pkpYIM1Pe1V5r3vDPLsRuyatmAeTRRdZA8b2iuQtFKjeZBOpmnMHSoNclYn3j3x8u48DgMcgODZAONZBKv7MTB46CPEOOBsOl9jlZCBlTiSnPtWO4X0SZBNWu8MAZDZD";
const UserChatBot = require('../models/user');
const mongoose = require('mongoose');


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
    entries.forEach((e)=>{
       let message = e.messaging;
       message.forEach(async (mess)=>{
           const user = await UserChatBot.findOne({
               user_id: mess.sender.id
           });
           if(!user){
               const user = new UserChatBot({
                   _id: new mongoose.Types.ObjectId(),
                   user_id: mess.sender.id,
                   chating_with: 0
               });
               user
                   .save()
                   .then(() => {
                        console.log("Save done.");
                   })
                   .catch((err) => {
                       console.log("Save error: ", err);
                   });
               await sendMessage(mess.sender.id, "Đang thả thính");
               findAndConnectWithDiffUser(mess.sender.id);
           }
           else{
               if(user.chating_with !==0){
                   if(mess.message.text !== "pp"){
                       sendMessage(user.chating_with, mess.message.text);
                   }
                   else{
                       sendMessage(user.user_id, "Ngưng kết nối.");
                       sendMessage(user.chating_with, "Đối phương đã ngưng kết nối.");
                       sendMessage(user.user_id, "Chat bất kì để tiếp tục thả.");
                       sendMessage(user.chating_with, "Chat bất kì để tiếp tục thả.");
                       const update1 = await UserChatBot.findOneAndDelete({user_id: user.user_id});
                       const update2 = await UserChatBot.findOneAndDelete({user_id: user.chating_with});
                   }
               }
           }
       })
    });
    res.status(200).send("OK");
});

async function findAndConnectWithDiffUser(user_id) {
    const newUser = await UserChatBot.find({
        chating_with: 0
    });
    newUser.forEach(async (e)=>{
       if(e.user_id !== user_id){
            const update1 = await UserChatBot.findOneAndUpdate({user_id: e.user_id}, {chating_with: user_id});
            const update2 = await UserChatBot.findOneAndUpdate({user_id: user_id}, {chating_with: e.user_id});
            sendMessage(user_id, "Thả thành công");
            sendMessage(e.user_id, "Thả thành công");
       }
    });
}

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