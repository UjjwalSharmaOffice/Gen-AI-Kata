import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryItem extends Document {
  name: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const InventoryItem: Model<IInventoryItem> =
  mongoose.models.InventoryItem ||
  mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;
