/* set of helper functions connecting backend and frontend*/


const fetchRecos = async (user, method, body = null, queryParams = {}) => {

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
        const url = `https://next-reco-app.onrender.com/api/recos${queryStr ? `?${queryStr}` : ""}`;
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

export const getRecos = async (user) => {
    const data = await fetchRecos(user, "GET", null, { uid: user.uid });
    return data;
}


export const getGroupRecos = async (user) => {
    const data = await fetchRecos(user, "GET", null, { isPrivate: "false" });
    return data;
}

export const getProposedRecos = async (user) => {
    const data = await fetchRecos(user, "GET", null, { isProposed: "true" });
    return data;
}

export const createReco = async (user, newReco) => {
    const data = await fetchRecos(user, "POST", newReco);
    return data;
}

export const updateReco = async (user, newReco) => {
    const data = await fetchRecos(user, "PATCH", newReco);
    return data;
}

export const deleteReco = async (user, reco) => {
    console.log("testing deleting a reco, ", reco)
    const data = await fetchRecos(user, "DELETE", null, { _id: reco._id });
    return data;
}
