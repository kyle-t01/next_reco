// Model for a reco

/* RECO */
/*
    title
    category
    address
    description
    is_private
    is_proposed
    uid

*/

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const recoSchema = new Schema({
    title: {
        type: String,

        required: true
    },
    category: {
        type: String,
        enum: ["food", "non-food"],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    isPrivate: {
        type: Boolean,
        default: false,
    },
    isProposed: {
        type: Boolean,
        default: false,
    },
    uid: {
        type: String,
        required: true,
    }

}, { timestamps: true })


module.exports = mongoose.model('Reco', recoSchema)

