import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true 
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    sold: {
        type: Boolean,
        required: true
    },
    dateOfSale: {
        type: Date,
        required: true,
    }
});

const transactionModel = mongoose.model('Transaction', transactionSchema);

export default transactionModel;
