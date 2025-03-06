// Reco Controller, assumes that the user has already been authenticated

const Reco = require('../models/recoModel');
const mongoose = require('mongoose');

// GET all Recos for a user
const getRecos = async (req, res) => {
    console.log("### GET ALL RECOS OF A USER ###")
    if (!req || !req.query) {
        return res.status(400).json({ error: "getRecos: missing query params" });
    }


    let filter = { ...req.query };

    try {
        const recos = await Reco.find(filter).sort({ createdAt: -1 })
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
    console.log("reco recieved in the body:", reco)
    if (!reco) {
        return res.status(400).json({ error: "createReco: missing reco object!" });
    }

    // drop the _id field
    delete reco._id;

    try {
        // reco with proper ID formatting
        const rawReco = await Reco.create(reco)
        console.log("rawReco created from the database: ", rawReco);
        // turn created documented into an object to format _id
        const newReco = rawReco.toObject()
        newReco._id = newReco._id.toString()
        console.log(newReco)
        res.status(200).json(newReco);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }

}

// DELETE a Reco for a user
const deleteReco = async (req, res) => {
    console.log("### DELETE A RECO OF A USER ###")
    if (!req || !req.query) {
        return res.status(400).json({ error: "deleteReco: missing reco _id" });
    }
    const { _id } = req.query;
    console.log(_id)
    try {
        // find one and delete
        const deletedReco = await Reco.findOneAndDelete(
            { _id: _id }
        );
        if (!deleteReco) {
            return res.status(404).json({ error: "Reco not found" });
        }
        console.log("success in deleting reco")
        res.status(200).json(deletedReco);
    } catch (error) {
        console.error("Error deleting reco:", error);
        res.status(500).json({ error: "Failed to delete reco" });
    }


}

// PATCH an existing Reco for a user
const updateReco = async (req, res) => {
    console.log("### attempting to UPDATE RECO ###")
    const reco = req.body
    console.log("The reco to be updated: ", reco)
    const _id = reco._id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: "Not a valid reco (id)" });
    }
    try {
        // find one and update
        const updatedReco = await Reco.findOneAndUpdate(
            { _id: _id },
            { ...reco },
            { new: true }
        );
        if (!updatedReco) {
            return res.status(404).json({ error: "Reco not found" });
        }
        console.log("success in updating reco")
        res.status(200).json(updatedReco);
    } catch (error) {
        console.error("Error updating reco:", error);
        res.status(500).json({ error: "Failed to update reco" });
    }
}

module.exports = {
    getRecos,
    getReco,
    createReco,
    deleteReco,
    updateReco,
};



