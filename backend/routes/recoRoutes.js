const express = require('express')
// const Reco = require('../models/recoModel')
const { getRecos, createReco, getReco, updateReco, deleteReco } = require('../controllers/recoController')

const router = express.Router();

// GET all Recos
router.get('/', getRecos)

// GET a Reco
router.get('/:id', getReco)

// POST a new Reco
router.post('/', createReco)

// PATCH an existing Reco
router.patch('/:id', updateReco)

// DELETE a Reco
router.delete('/:id', deleteReco)


module.exports = router;