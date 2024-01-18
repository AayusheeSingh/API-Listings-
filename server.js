// Setup
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
