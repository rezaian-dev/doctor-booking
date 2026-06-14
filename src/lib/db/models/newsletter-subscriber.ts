// 📧 Newsletter subscribers — emails collected from footer subscription form
import { Schema, model, models, Model, InferSchemaType } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // 🔌 Status: active (subscribed) | unsubscribed (opted-out later)
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
  },
  { timestamps: true }
);

export type INewsletterSubscriber = InferSchemaType<typeof NewsletterSubscriberSchema>;

export const NewsletterSubscriber: Model<INewsletterSubscriber> =
  (models["NewsletterSubscriber"] as Model<INewsletterSubscriber>) ??
  model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
