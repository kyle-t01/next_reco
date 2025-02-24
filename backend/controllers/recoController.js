// Reco Controller, assumes that the user has already been authenticated

const Reco = require('../models/recoModel');
const mongoose = require('mongoose');

// GET all Recos for a user
const getRecos = async (req, res) => {
    // 
    console.log("tried to GET all Recos")

}

// GET a Reco for a user
const getReco = async (req, res) => {
    // 
    console.log("tried to GET a Reco")

}

// POST a new Reco for a user
const createReco = async (req, res) => {
    // 

    console.log("tried to POST A NEW Reco")

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



