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
- [create-lookup] finding an restaurant, point of interest, venue, or business on google maps, and clearly a public location
- [create-manual] the address or location is a personal or private
- [update-mode] updating an existing reco, while taking into account of user supplied reco.
- [delete-mode] deleting an existing reco.
- [sort-filter] user wants or needs the sorting filtering or recommendation of recos, for example: I want to... Recommend me... Find a place(s) that...  I want Greek cuisine... I want to go to public location
- [invalid] the user request does not match any of the above categories

Then based on the mode, generate the appropiate JSON response:
if [create-manual or create-lookup], generate a Reco with details fill in.
if [update-mode], modify the user given reco, you MUST take into account of the reco supplied by user.
if [delete-mode], return the deletion criteria as deleteCriteria AND the categoryMode.
if [sort-filter], return ONLY the categoryMode, no other attributes are to be included.
if [invalid], return ONLY the categoryMode, no other attributes are to be included.

Reco Mongoose Schema:
{
  "categoryMode": "classification label"| without the [],
  "title": (string, required),
  "subTitle": (string, optional | punchline of any dates, deals or important info),
  "category": (either "food" or "non-food"),
  "address": (string, if in [create-lookup] infer at least a suburb or a city name and return venue name and location together for the sake of google places api, for example: Cool Place, Suburb, or Cool Place 2, City),
  "description": (string, optional),
  "isPrivate": (boolean, default true) ,
  "isProposed": (boolean, default false),
  "placeID": (null unless supplied by reco ONLY),
  "uid": (null unless supplied by reco ONLY),
  "isVisited": (false unless supplied by reco ONLY),
  "_id": (discard this attribute entirely unless supplied by reco ONLY)
}
If the subTitle, description was generated by you, at the start of the tile string put [A.I.] including space and brackets

return only valid json, nothing else
`

// subset systemPrompt used for filtering, sorting and recommending a susbet of recos back to the user
/*
Legacy prompts:
- filtering means removing non-matching recos based on the attributes found ONLY within the Reco Schema
- sorting means rearranging the list of recos based on the attributes found ONLY within the Reco Schema
- filteringCriteria is just the filtering rules in JSON form
- sortingCriteria is just the sorting rules in JSON form
*/
const subsetSystemPrompt = `
You are an AI the processes user requests and a structured list of Recos
First, you must always follow the below ruleset:
- always receive a list of Reco objects as input
- always return a list of Reco._id extracted from given list as output
- you must ONLY do tailoring on the given list, not modify its contents
- tailoring means to be aware of recos in a context aware way

Tailoring:
- you must take into account of each Reco's attibutes
- you must analyse also the text within the title, subTitle, description, and address to determine which recos match user's needs
- you must understand what the user wants and try to match them to the recos

Reco Mongoose Schema:
{
  "title": (string),
  "subTitle": (string),
  "category": (either "food" or "non-food"),
  "address": (string),
  "description": (string),
  "isPrivate": (boolean | means only the user can see it) ,
  "isProposed": (boolean | means it appears under the [Let's do this next!] tab, where it is proposed),
  "placeID": (string | means whether it is a verified place that can be found on google maps),
  "uid": (string | determines the user who authored a reco),
  "isVisited": (boolean | means whether the user has marked it visited or completed or finished),
  "_id": (string)
}

expected output:
{ "data":[], }


return only valid json, nothing else
`



// use authentication when using AI
router.use(authMW)


// POST: handle prompts that are related to reco lists
router.post('/subset', async (req, res) => {

    console.log("### ANALYSING AI PROMPT ###")
    const { prompt, recos } = req.body
    console.log("The prompt recieved was: ", prompt)

    console.log("The list of reco recieved was: ", recos.map((reco) => reco.title))

    console.log("The list of recos sent to ai was: ", JSON.stringify(recos))

    // check whether there was a prompt
    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt was empty!" });
    }


    try {
        console.log("awaiting response from openai...")
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                // use subsetPrompt
                { role: "system", content: subsetSystemPrompt },
                { role: "user", content: `User prompt: ${prompt}` },
                { role: "user", content: `List of Recos: ${JSON.stringify(recos)}` },
                { role: "user", content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 2048,
            top_p: 1
        });

        console.log("raw AI response: ", aiResponse.choices[0].message.content)

        const result = JSON.parse(aiResponse.choices[0].message.content)
        console.log("The response from the AI was: ", result);
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error.message });
    }


});


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

    console.log("existing reco is: ", reco)
    try {
        console.log("awaiting response from openai...")
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Reco supplied by user: ${JSON.stringify(reco)}` },
                { role: "user", content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 1024,
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