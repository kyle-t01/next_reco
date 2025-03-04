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
    const { prompt, reco } = req.body
    console.log("The prompt recieved was: ", prompt)
    console.log("The reco recieved was: ", reco)

    // prompt engineering for system prompt
    // input: unstructured data => output: reco object
    const systemPrompt = "You are an ai that extracts structured data from unstructured user requests. Your task is to parse the user query into a JSON object formatted as a Reco. A Reco should include -title (string,required) -subTitle(string, optional) -category(specificallyeither food or non-food) -isPrivate(boolean, default false) -isProposed(boolean, default false) -googleData(null) -isLookup(boolean). Additionally categorise the user request into [manual] if the user specifies a custom name and address, or [lookup] "

    // check whether there was a prompt
    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt was empty!" });
    }

    // give the ai some context
    if (reco) {
        console.log("should add some context prompts to AI")
    }

    try {
        console.log("awaiting response from openai...")
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt },],
        });
        console.log("raw ai response was: ", aiResponse);
        const result = aiResponse.choices[0].message.content
        console.log("The response from the AI was: ", result);
        res.status(200).json({ result: result });
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }


});


module.exports = router;