import { Router } from "express";
import {
  addVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicle,
  filterVehicle,
} from "../controllers/vehicle.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(upload.single("vehicleImage"), addVehicle);
router.route("/").get(getAllVehicles);
router.route("/filter").get(filterVehicle);
router.route("/search/:model").get(searchVehicle);
router.route("/:id").get(getVehicle);
router.route("/:id").patch(upload.single("vehicleImage"), updateVehicle);
router.route("/:id").delete(deleteVehicle);

export default router;
