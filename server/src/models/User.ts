import { Schema, model } from 'mongoose';

const User = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true, collection: 'users' }
);

export default model('Users', User);
