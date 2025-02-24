//  middleware that handles authentication

const admin = require('firebase-admin')

const authMW = async (req, res, next) => {
    try {
        // get firebase ID token from request header
        const idToken = req.header('Authorization').split('Bearer')[1];

        // use firebase admin sdk to verify ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken)

        // user is auth'd so attach user info to the request object
        req.user = decodedToken;

        next();


    } catch (error) {
        res.state(401).json({ error: 'Unauth\'d Access' })

    }
}

module.exports = authMW;