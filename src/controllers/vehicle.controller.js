import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Vehicle from "../models/vehicle.model.js";

export const addVehicle = asyncHandler(async (req, res) => {
  const vehicleImageLocalPath = req.file?.path;

  if (!vehicleImageLocalPath) {
    throw new ApiError(400, "vehicle image is required");
  }

  const vehicleImage = await uploadOnCloudinary(vehicleImageLocalPath);

  if (!vehicleImage) {
    throw new ApiError(400, "Failed to upload vehicle image");
  }

  const newVehicle = await Vehicle.create({
    ...req.body,
    image: vehicleImage.url,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Vehicle added successfully", newVehicle));
});

export const getAllVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicles fetched successfully", vehicles));
});

export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw new ApiError(404, "Vehicle is not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle fetched successfully", vehicle));
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const updates = { ...req.body };

  if (req.file?.path) {
    const vehicleImage = await uploadOnCloudinary(req.file.path);
    if (!vehicleImage) {
      throw new ApiError(400, "faild to upload new vehicle image");
    }

    updates.image = vehicleImage.url;
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle updated successfully", updatedVehicle));
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    throw new Error(404, "Vehicle is not found ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle deleted successfully", vehicle));
});

export const searchVehicle = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    model: { $regex: req.params.model, $options: "i" },
  });

  if (vehicles.length === 0) {
    throw new ApiError(404, "No vehicles found for the specified model");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Search successfully", vehicles));
});

export const filterVehicle = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.make) {
    filter.make = { $regex: req.query.make, $options: "i" };
  }

  if (req.query.model) {
    filter.model = { $regex: req.query.model, $options: "i" };
  }

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  const vehicles = await Vehicle.find(filter);

  if (vehicles.length === 0) {
    throw new ApiError(404, "No vehicles found for the specified filter");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Filter successfully", vehicles));
});