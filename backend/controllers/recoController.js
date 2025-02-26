// Reco Controller, assumes that the user has already been authenticated

const Reco = require('../models/recoModel');
const mongoose = require('mongoose');

// GET all Recos for a user
const getRecos = async (req, res) => {
    console.log("### GET ALL RECOS OF A USER ###")
    if (!req || !req.query) {
        return res.status(400).json({ error: "getRecos: missing userID" });
    }
    const { uid } = req.query

    try {
        const recos = await Reco.find({ uid }).sort({ createdAt: -1 })
        res.status(200).json(recos)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }

}

// GET a Reco for a user
const getReco = async (req, res) => {
    // 
    console.log("")
    console.log("tried to GET a Reco")

}

// POST a new Reco for a user
const createReco = async (req, res) => {
    console.log("### CREATE RECO ###")
    const reco = req.body
    console.log("newReco from req.body", reco)

    try {
        const newReco = await Reco.create({ ...reco })
        console.log("success in creating a new Reco")
        res.status(200).json(newReco);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }

}

// DELETE a Reco for a user
const deleteReco = async (req, res) => {
    // 
    console.log("tried to Delete a Reco")

}

// PATCH an existing Reco for a user
const updateReco = async (req, res) => {
    // 
    console.log("tried to Update a Reco")

}

module.exports = {
    getRecos,
    getReco,
    createReco,
    deleteReco,
    updateReco,
};



