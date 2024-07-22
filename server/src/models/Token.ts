const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
},{timestamps: true, collection: 'tokens'});

export default model('Token', TokenSchema);
