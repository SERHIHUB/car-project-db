import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, default: null },
    role: {
      type: String,
      default: 'observer',
      enum: ['observer', 'user', 'admin'],
    },
    thema: { type: String, default: 'firstThema' },
    owner: { type: String, default: null },
    verify: { type: Boolean, default: false },
    verifyToken: { type: String, default: null },
    //   userAvatar: { type: String, required: true },
    // userAvatar: { type: String, default: '...' },
  },
  { versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = model('users', userSchema);
