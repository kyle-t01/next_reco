/* set of helper functions connecting backend and frontend*/


const fetchRecos = async (user, method, body = null) => {

    console.log("fetching Recos for user: ", user.uid, " via: ", method)



    try {
        // get current id token of user
        const idToken = await user.getIdToken();

        // request headers to contain idToken
        const headers = {
            'Authorization': `Bearer ${idToken}`,
            "Content-Type": "application/json",
        };

        const response = await fetch('http://localhost:4000/api/recos', {
            method: method,
            headers: headers,
            // only add a body if not null
            ...(body ? { body: JSON.stringify(body) } : {}),
        });


        if (response.ok) {

            const data = await response.json()
            return data
        } else {

            return null
        }
    } catch (error) {
        console.log("error:", error);
    }




}

export const getRecos = async (user) => {
    const data = await fetchRecos(user, "GET");
    return data;
}

export const createReco = async (user, newReco) => {
    const data = await fetchRecos(user, "POST", newReco);
    return data;
}