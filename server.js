1.	Add the following declaration at the top of your server.js file

/********************************************************************************
*  WEB422 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name:  Aayushee Singh   Student ID: 173927211  Date: 19th January,2024
*  Published URL: ___________________________________________________________
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

// Add a new listing
app.post('/api/listings', async (req, res) => {
    try {
        const newListing = await db.addNewListing(req.body);
        res.status(201).json(newListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get listings with optional pagination and name filter
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

// Get a specific listing by ID
app.get('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await db.getListingById(id);
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a specific listing by ID
app.put('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.updateListingById(req.body, id);
        if (result.nModified > 0) {
            res.json({ message: 'Listing updated successfully' });
        } else {
            res.status(404).json({ error: 'Listing not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a specific listing by ID
app.delete('/api/listings/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteListingById(id);
        if (result.deletedCount > 0) {
            res.json({ message: 'Listing deleted successfully' });
        } else {
            res.status(404).json({ error: 'Listing not found' });
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
