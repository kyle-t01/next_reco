/* set of helper functions connecting backend and frontend for AI prompts */

export const fetchAIResponse = async (user, reco, prompt) => {
    console.log("fetching AI response...")
    try {
        // get current id token of user
        const idToken = await user.getIdToken();

        // request headers to contain idToken
        const headers = {
            'Authorization': `Bearer ${idToken}`,
            "Content-Type": "application/json",
        };

        // request options
        const requestOptions = {
            method: "POST",
            headers: headers,
        };

        requestOptions.body = JSON.stringify({
            prompt: prompt,
            reco: reco || null
        });

        const url = `https://next-reco-app.onrender.com/api/ai`;
        console.log("url: ", url)
        const response = await fetch(url, requestOptions);

        if (response.ok) {

            const data = await response.json()
            return data
        } else {
            console.error(`ERROR`);
            return null
        }
    } catch (error) {
        console.log("error:", error);
    }

}





