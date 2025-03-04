/* set of helper functions connecting backend and frontend for AI prompts */

const fetchAI = async (user, method, body = null, queryParams = {}) => {

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
            method: method,
            headers: headers,
        };

        // add body when req method is not GET
        if (body && method !== "GET") {
            requestOptions.body = JSON.stringify(body);
            console.log(requestOptions.body)
        }

        // construct the query string
        const queryStr = new URLSearchParams(queryParams).toString();
        const url = `https://next-reco-app.onrender.com/api/ai${queryStr ? `?${queryStr}` : ""}`;
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


export const fetchPostAI = async (user, reco) => {
    const data = await fetchAI(user, "POST", reco);
    return data;
}


