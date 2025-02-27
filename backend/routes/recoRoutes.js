const express = require('express')
const { getRecos, createReco, getReco, updateReco, deleteReco } = require('../controllers/recoController')

const router = express.Router();
const authMW = require('../middlewares/authMiddleware');

// use authentication when using Reco
router.use(authMW)

// GET all Recos
router.get('/', getRecos)

// GET a Reco
router.get('/', getReco)

// POST a new Reco
router.post('/', createReco)

// PATCH an existing Reco
router.patch('/', updateReco)

// DELETE a Reco
router.delete('/', deleteReco)


module.exports = router;