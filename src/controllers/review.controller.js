import Review from "../models/review.model.js";
import Vehicle from "../models/vehicle.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import mongoose from "mongoose";

export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, vehicleId } = req.body;

  if (!rating || !vehicleId) {
    throw new ApiError(400, "Rating and vehicleId are required");
  }

  const review = await Review.create({
    user: req.user._id,
    vehicle: vehicleId,
    rating,
    comment,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Review added successfully", review));
});

export const getVehicleReviews = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const reviews = await Review.aggregate([
    {
      $match: {
        vehicle: new mongoose.Types.ObjectId(vehicleId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $first: "$user" },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "Reviews fetched successfully", reviews));
});

export const getVehicleRatingStats = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;

  const stats = await Review.aggregate([
    {
      $match: {
        vehicle: new mongoose.Types.ObjectId(vehicleId),
      },
    },
    {
      $group: {
        _id: "$vehicle",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "Vehicle rating stats", stats[0] || {}));
});
