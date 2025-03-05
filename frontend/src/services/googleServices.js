// helper function that requests google place details from Google Places API using a placeID
export const fetchGoogleData = async (reco) => {
    console.log("fetching Google Data...")
    const placeID = reco.placeID;

    if (!reco) return null;
    if (!placeID || placeID.trim === "") return null;

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`
        );
        const data = await response.json();

        if (data.status !== "OK") {
            console.error("Google Places API error");
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching Google Place details:", error);
        return null;
    }

}
