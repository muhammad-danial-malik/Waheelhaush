import { Router } from "express";
import {
  addReview,
  getVehicleReviews,
  getVehicleRatingStats,
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, addReview);
router.route("/:vehicleId").get(getVehicleReviews);
router.route("/:vehicleId/stats").get(getVehicleRatingStats);

export default router;
