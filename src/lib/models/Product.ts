// // models/Product.ts
// import mongoose, { Schema, model, Model, Document } from "mongoose";
// import { IProduct } from "@/utils/interface";

// // Schema for Product without custom id field
// const ProductSchema = new Schema<IProduct>(
//   {
//     name: { type: String, required: true },
//     description: { type: String, required: false },
//     image: { type: String, required: true },
//     price: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export const Product: Model<IProduct> =
//   mongoose.models.Product || model<IProduct>('Product', ProductSchema);