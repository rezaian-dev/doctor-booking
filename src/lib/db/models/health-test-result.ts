import { Schema, model, models, Model, InferSchemaType, HydratedDocument } from 'mongoose';

const HealthTestResultSchema = new Schema(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers:   { type: Schema.Types.Mixed, required: true }, // Record<number, string>
    // 🏷️ Snapshot of user info at test time
    userName:  { type: String, required: true },
    userPhone: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    // 🖼️ User avatar snapshot — for admin display
    userAvatar: { type: String, default: '' },
    // 📨 Set when admin sends a reply — null = unreplied
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export type IHealthTestResult        = InferSchemaType<typeof HealthTestResultSchema>;
export type HealthTestResultDocument = HydratedDocument<IHealthTestResult>;

export const HealthTestResult: Model<IHealthTestResult> =
  (models['HealthTestResult'] as Model<IHealthTestResult>) ??
  model<IHealthTestResult>('HealthTestResult', HealthTestResultSchema);
