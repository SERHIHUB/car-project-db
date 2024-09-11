import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    owner: { type: String, default: null },
    department: {
      type: String,
      default: 'all',
      enum: ['comfort', 'light', 'all'],
    },
  },
  { versionKey: false },
);

export const Contact = model('contacts', contactSchema);
