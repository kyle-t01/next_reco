// Model for a reco

/* RECO */


const mongoose = require('mongoose')

const Schema = mongoose.Schema

const recoSchema = new Schema({
    title: {
        type: String,

        required: true
    },
    subTitle: {
        type: String,

    },
    category: {
        type: String,
        enum: ["food", "non-food"],
        required: true
    },
    address: {
        type: String,
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
    isVisited: {
        type: Boolean,
        default: false,
    },
    placeID: {
        type: String,
    },
    uid: {
        type: String,
        required: true,
    }

}, { timestamps: true })


module.exports = mongoose.model('Reco', recoSchema)

