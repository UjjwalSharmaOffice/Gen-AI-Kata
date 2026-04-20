import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRequest extends Document {
  employeeName?: string;
  itemName: string;
  quantity: number;
  remarks?: string;
  status: "Pending" | "Approved" | "Rejected";
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    employeeName: { type: String, trim: true, default: "" },
    itemName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    remarks: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const Request: Model<IRequest> =
  mongoose.models.Request ||
  mongoose.model<IRequest>("Request", RequestSchema);

export default Request;
