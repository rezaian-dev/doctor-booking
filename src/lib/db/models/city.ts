import { Schema, model, models, type Model, type InferSchemaType } from "mongoose";

// 🏙️ Reference collection for cities — dynamic & growable (unlike specialties/insurances)
const CitySchema = new Schema(
  {
    slug:     { type: String, required: true, unique: true, index: true }, // 🔑 URL id (?city=tehran)
    label:    { type: String, required: true },  // 📄 Persian display label — MUST match Doctor.city
    province: { type: String, required: true },  // 🗺️ Province (for grouping & richer UI)
    order:    { type: Number, default: 0 },      // 🔢 Optional manual sort weight
  },
  { timestamps: true, collection: "cities" }
);

export type ICity = InferSchemaType<typeof CitySchema>;
type CityModel = Model<ICity>;

// ♻️ Reuse the compiled model on hot-reload (same pattern as Doctor)
export const City =
  (models["City"] as CityModel | undefined) ?? model<ICity>("City", CitySchema);
