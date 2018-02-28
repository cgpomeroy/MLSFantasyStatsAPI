'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    firstName: {
        type: String,
        required: "Please enter the player's first name."
    },
    lastName: {
        type: String,
        required: "Please enter the player's last name."
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
        type: Date,
    },
    image: {
        type: String,
        default: "No Image"
    },
    position: {
        type: String,
        default: "Unknown"
    },
    number: {
        type: Number
    },
    realName: {
        type: String
    },
    height: {
        type: String
    },
    weight: {
        type: Number
    },
    birthplace: {
        type: String
    },
    social: {
        type: String
    },
    designation: {
        type: String
    }
});

module.exports = mongoose.model('Players', PlayerSchema);