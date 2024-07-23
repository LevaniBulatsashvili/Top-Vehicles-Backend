import { Router } from "express";
import {
  getVehicles,
  getVehicle,
  postVehicle,
  updateVehicle,
  likeVehicle,
  searchVehicles,
} from "../handlers/vehicles";

const vehicleRouter = Router();

vehicleRouter.get("/", getVehicles);

vehicleRouter.get("/:vehicleId", getVehicle);

vehicleRouter.post("/search", searchVehicles);

vehicleRouter.post("/", postVehicle);

vehicleRouter.post("/like-vehicle", likeVehicle);

vehicleRouter.put("/:id", updateVehicle);

export default vehicleRouter;
