import { Schema, model } from 'mongoose';

interface INews extends Document {
  author: Schema.Types.ObjectId;
  text: string;
  quotes?: string[];
  logo?: string;
  files?: string[];
  publicDate?: string;
}

const News = new Schema(
  {
    author: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    quotes: [{ type: String }],
    logo: { type: String },
    files: [{ type: String }],
    publicDate: { type: Date },
  },
  { timestamps: true, collection: 'news' }
);

export default model<INews>('News', News);
