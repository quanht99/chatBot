const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id: Number,
    chating_with: Number
});

module.exports = mongoose.model('userChatBot', userSchema);
