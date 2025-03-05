// helper function that requests google place details from Google Places API using a placeID
export const fetchGoogleData = async (placeId) => {
    console.log("fetching Google Data...")
    const placeID = placeId;


    if (!placeID || placeID.trim() === "") return null;

    try {

        // request options
        const requestOptions = {
            method: "GET",
        };


        const url = `https://next-reco-app.onrender.com/api/google?placeID=${placeID}`;
        console.log("url: ", url)
        const response = await fetch(url, requestOptions);

        if (response.ok) {

            const data = await response.json()
            return data
        } else {
            console.error(`Google Places ERROR`);
            return null
        }
    } catch (error) {
        console.log("error:", error);
    }


}
