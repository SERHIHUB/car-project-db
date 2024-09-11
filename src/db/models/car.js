import mongoose, { Schema, model } from 'mongoose';

const carSchema = new Schema(
  {
    carModel: { type: String, required: true },
    carNumber: { type: String, required: true },
    // carPhoto: { type: String, required: true },
    price: { type: String, required: true },
    paymentDate: { type: String, required: true },
    contact: { type: String, default: null },
    // isPaid: { type: Boolean, default: false },
    owner: { type: String, default: null },
    author: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

export const Car = model('cars', carSchema);
