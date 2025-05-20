import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      default: "Automatic",
      required: true,
    },
    engineType: {
      type: String,
      enum: ["Petrol", "Diesel", "Hybrid", "Electric"],
      default: "Petrol",
      required: true,
    },
    engineCapacity: {
      type: Number,
      required: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
    condition: {
      type: String,
      enum: ["New", "Used"],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;
