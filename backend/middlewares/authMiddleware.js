//  middleware that handles authentication

const admin = require('firebase-admin')

const authMW = async (req, res, next) => {
    try {
        console.log("using authMW middleware ")
        // get firebase ID token from request header
        const idToken = req.header('Authorization').split('Bearer')[1].trim();

        // use firebase admin sdk to verify ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken)

        // user is auth'd so attach user info to the request object
        req.user = decodedToken;
        console.log("success in decoding token")
        next();


    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error })


    }
}

module.exports = authMW;