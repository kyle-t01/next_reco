const express = require('express')
const { getRecos, createReco, getReco, updateReco, deleteReco, getAllRecos } = require('../controllers/recoController')

const router = express.Router();
const authMW = require('../middlewares/authMiddleware');

// use authentication when using Reco
router.use(authMW)

// GET all Recos authored by the user onnly
router.get('/', getRecos)

// GET all Recos that are visible to the user
router.get('/all', getAllRecos)

// GET a Reco
router.get('/', getReco)

// POST a new Reco
router.post('/', createReco)

// PATCH an existing Reco
router.patch('/', updateReco)

// DELETE a Reco
router.delete('/', deleteReco)


module.exports = router;