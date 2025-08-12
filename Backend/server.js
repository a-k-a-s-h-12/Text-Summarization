const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  

const authRoutes = require('./routes/auth')
const fileRotues = require('./routes/file')
const questionRoutes = require('./routes/questionandAnswer');

app.use(cors({ origin: "https://text-summarization-5l4z.onrender.com", credentials: true }));
app.use(express.json());
app.use('/auth',authRoutes)
app.use('/file',fileRotues)
app.use('/getquestionAndAnswer',questionRoutes);

mongoose.connect(process.env.MONGOID)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server Running successfully ---> PORT: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });



