require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


require('./firebase/firebaseAdmin')
const recoRoutes = require('./routes/recoRoutes')
const aiRoutes = require('./routes/aiRoutes')
const googleRoutes = require('./routes/googleRoutes')

const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// routes
app.use('/api/recos', recoRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/google', googleRoutes);

// connect to the database
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('connected to DB and listening on', process.env.PORT);
        })
    })
    .catch((error) => {
        console.log(error)
    })

