'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    name: {
        type: String,
        required: "Please enter the player's name."
    },
    created_date: {
        type: Date,
        default: Date.now()
    },
    currentTeam: {
        type: String,
        default: "Unknown"
    },
    dob: {
        type: String,
        default: "Unknown"
    },
    nationality: {
        type: String,
        default: "Unknown"
    }
});

module.exports = mongoose.model('Players', PlayerSchema);