import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from 'mongoose';

const ArticleSchema = new Schema(
  {
    title:       { type: String, required: true },
    slug:        { type: String, required: true, unique: true },
    content:     { type: String, required: true },
    excerpt:     { type: String, default: '' },
    coverImage:  { type: String, default: '' },
    author:      { type: String, default: '' },
    status:      { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags:        [{ type: String }],
  },
  { timestamps: true }
);

export type IArticle        = InferSchemaType<typeof ArticleSchema>;
export type ArticleDocument = HydratedDocument<IArticle>;

export const Article: Model<IArticle> =
  (models['Article'] as Model<IArticle>) ?? model<IArticle>('Article', ArticleSchema);
