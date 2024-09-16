import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ticketCollection = 'ticket';

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        default: () => uuidv4().replace(/-/g, ''),
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchaser: {
        type: String,
        required: true,
    },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }]
}, { timestamps: true });

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
