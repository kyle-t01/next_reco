require('dotenv').config();
const express = require('express')
const OpenAI = require("openai");

const router = express.Router();
const authMW = require('../middlewares/authMiddleware');

// init openai object
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


// use authentication when using AI
router.use(authMW)

// POST: handle AI prompts
router.post('/', async (req, res) => {

    console.log("### ANALYSING AI PROMPT ###")
    const body = req.body
    console.log("req.body", body)

    try {

        console.log("success in an AI prompt")
        res.status(200).json(body);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }


});


module.exports = router;