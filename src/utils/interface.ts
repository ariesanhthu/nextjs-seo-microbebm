import { Document } from "mongoose";
// Interface cho Product
export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  createdAt?: Date;
  updatedAt?: Date;
}
  
// Interface cho Project
export interface IProject extends Document {
    _id: string;
    name: string;
    description: string;
    image: string;
  }
  
// Interface cho Project
export interface IPolicy extends Document {
    _id: string;
    title: string;
    description: string;
  }
  