
const express = require('express');
const cors = require('cors');
const app = express();
const Transaction = require('./Models/Transaction');
const { mongo, default: mongoose } = require('mongoose');
require('dotenv').config();

const urlLink =process.env.MONGO_URL;

app.use(cors());
app.use(express.json())
app.get('/api/test', (req, res)=>{
    res.json("Test ok")
});
app.delete('/api/transactionDelete', async(req, res)=>{
    console.log("deleting.....")
    try{

        await mongoose.connect(urlLink);
        const transactions = await Transaction.deleteOne({_id: req.body._id});
        mongoose.connection.close();
        res.json(transactions);
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the transaction.' });
      }
})

app.post('/api/transaction', async (req, res)=>{
    await mongoose.connect(urlLink);
    const {name, price, description, datetime} = req.body;
    const transaction = await Transaction.create({name,price, description, datetime});
    res.json(transaction);
})

app.get('/api/transactions', async (req, res)=>{
    await mongoose.connect(urlLink);
    const transactions = await Transaction.find({});
    res.json(transactions);
})

app.listen(4000, ()=>{
    console.log("On fire baby!")
});