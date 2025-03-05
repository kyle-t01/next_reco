require('dotenv').config();
const express = require('express')
const OpenAI = require("openai");

const router = express.Router();
const authMW = require('../middlewares/authMiddleware');

// init openai object
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// prompt engineering for system 
const systemPrompt = `
You are an AI that processes user requests into structured Reco objects.
First, classify the request into one of the below categories based on the user:
- [create-manual] specifying a custom event and full address, and the address or location is a personal location
- [create-lookup] finding an restaurant, point of interest, venue, or business on google maps.
- [update-mode] updating an existing reco.
- [delete-mode] deleting an existing reco.
- [sort-filter] filtering or sorting existing recos.

Then based on the mode, generate the appropiate JSON response:
if [create-manual or create-lookup], generate a Reco with details fill in.
if [update-mode], modify the user given reco.
if [delete-mode], return the deletion criteria.
if [sort-filter], return the filtering criteria.

Reco Mongoose Schema:
{
  "categoryMode": "classification label"| without the [],
  "title": (string, required),
  "subTitle": (string, optional | punchline of any dates, deals or important info),
  "category": (either "food" or "non-food"),
  "address": (string, or "N/A" if not specified),
  "description": (string, optional),
  "isPrivate": (boolean, default true) ,
  "isProposed": (boolean, default false),
  "placeID": (null unless supplied by reco ONLY),
  "uid": (null unless supplied by reco ONLY),
  "_id": (null unless supplied by reco ONLY)
}

return only valid json, nothing else
`


// use authentication when using AI
router.use(authMW)

// POST: handle AI prompts
router.post('/', async (req, res) => {

    console.log("### ANALYSING AI PROMPT ###")
    const { prompt, reco } = req.body
    console.log("The prompt recieved was: ", prompt)
    console.log("The reco recieved was: ", reco)



    // check whether there was a prompt
    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt was empty!" });
    }


    try {
        console.log("awaiting response from openai...")
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
                { role: "user", content: `Existing Reco Data: ${JSON.stringify(reco)}` },
            ],
            temperature: 0.2,
            max_tokens: 512,
            top_p: 1
        });



        const result = JSON.parse(aiResponse.choices[0].message.content)
        console.log("The response from the AI was: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }


});


module.exports = router;