require('dotenv').config();
const express = require('express')
const axios = require('axios')
const router = express.Router();

// don't use authentication
// router.use(authMW)

// handle requests to get place details
router.get('/', async (req, res) => {

    console.log("### FETCHING GOOGLE PLACE DETAILS ###")
    if (!req || !req.query) {
        return res.status(400).json({ error: "getRecos: missing query params" });
    }


    const { placeID } = req.query;


    // check whether there was a placeID supplied
    if (!placeID || placeID === "") {
        return res.status(400).json({ error: "PlaceID was empty!" });
    }


    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status !== "OK") {
            console.error("Google Places API Error:", response.data.status);
            return res.status(400).json({ error: response.data.status });
        }
        const result = response.data.result;
        const googleData = {
            name: result.name,
            address: result.formatted_address,
            phone: result.formattted_phone_number,
            editorialSummary: result.editorial_summary?.overview || null,
            photoReference: result.photos ? result.photos[0]?.photo_reference : null,
            imageURL: result.photos ? result.photos[0]?.html_attributions[0] : null,
            priceLevel: result.price_level,
            rating: result.rating,
            website: result.website,
            url: result.url,
            userRatingsTotal: result.user_ratings_total,
            vicinity: result.vicinity
        }


        console.log("Google Place Data:", googleData);
        res.status(200).json(googleData);

    } catch (error) {
        console.error("Error fetching Google Place details:", error);
        res.status(500).json({ error: "Failed to fetch place details" });
    }

});

// fetch an image
router.get('/image', async (req, res) => {
    console.log("### FETCHING A GOOGLE PLACE IMAGE ###");

    const { photoReference } = req.query;
    if (!photoReference) {
        return res.status(400).json({ error: "Photo reference is missing!" });
    }

    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;

        // get image data 
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(response.data);
    } catch (error) {
        console.error("Error fetching Google Place photo:", error);
        res.status(500).json({ error: "Failed to fetch place photo" });
    }
});

// try to get placeID from searchText
router.get('/search', async (req, res) => {

    console.log("### FETCHING GOOGLE PLACE_ID FROM SEARCHTEXT ###")
    if (!req || !req.query) {
        return res.status(400).json({ error: "googleRoutes/search : missing query params" });
    }


    const { searchText } = req.query;


    // check whether there was a searchText supplied
    if (!searchText || searchText === "") {
        return res.status(400).json({ error: "searchText was empty!" });
    }


    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchText)}&inputtype=textquery&fields=place_id&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status !== "OK") {
            console.error("Google Places API Error:", response.data.status);
            return res.status(400).json({ error: response.data.status });
        }

        const placeID = response.data.candidates[0].place_id;


        console.log("Google Place ID found:", placeID);
        res.status(200).json(placeID);

    } catch (error) {
        console.error("Error fetching Google Place ID:", error);
        res.status(500).json({ error: "Failed to fetch place ID" });
    }

});

module.exports = router;