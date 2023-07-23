const { Schema, model } = require("mongoose");

const transactionSchema = new Schema({
    name: {type: String, required:true},
    price: {type: Number, required:true}, 
    description: {type: String, required:true},
    datetime: {type:Date, required:true}
});

const transactionModel = model('Transaction', transactionSchema)
module.exports = transactionModel;