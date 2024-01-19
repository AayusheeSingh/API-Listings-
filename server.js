/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name:  Aayushee Singh      Student ID: 173927211     Date: 19th January,2024
*  Published URL: ______________________________________________________________
*
********************************************************************************/


const express = require('express');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

require('dotenv').config();

const ListingsDB = require('./modules/listingsDB.js');
const db = new ListingsDB();

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post('/api/listings', async (req, res) => {
    try {
        const newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/listings', async (req, res) => {
    const { page, perPage, name } = req.query;
    try {
        const listings = await db.getAllListings(page, perPage, name);
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await db.getListingById(id);
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ error: 'Cant find the listing' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/listings/:id', async (req, res) => {
    try {
        const updatedListing = await db.updateListingById(req.body, req.params.id);
        if (updatedListing) {
            res.json(updatedListing);
        } else {
            res.status(404).send('Listing not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteListingById(id);
        if (result.deletedCount > 0) {
            res.json({ message: ' Deleted successfully' });
        } else {
            res.status(404).json({ error: 'Cant find the listing' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use((req, res) => {
    res.status(404).send('Resource not found');
  });


db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`server listening on: ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
