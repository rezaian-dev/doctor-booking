import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from "mongoose";

const MessageSchema = new Schema(
  {
    toUserId:    { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromAdminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject:     { type: String, required: true },
    body:        { type: String, required: true },
    isRead:      { type: Boolean, default: false },
    // 🔗 Optional link to the health test that triggered this message
    testResultId: { type: Schema.Types.ObjectId, ref: "HealthTestResult", default: null },
  },
  { timestamps: true }
);

export type IMessage      = InferSchemaType<typeof MessageSchema>;
export type MessageDocument = HydratedDocument<IMessage>;

export const Message: Model<IMessage> =
  (models["Message"] as Model<IMessage>) ??
  model<IMessage>("Message", MessageSchema);
