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
    is_private: {
        type: Boolean,
        default: false,
    },
    is_proposed: {
        type: Boolean,
        default: false,
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }

}, { timestamps: true })


module.exports = mongoose.model('Reco', recoSchema)

