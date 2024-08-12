import { Router } from "express";
import {
  getVehicles,
  getVehicle,
  postVehicle,
  updateVehicle,
  likeVehicle,
  searchVehicles,
  deleteVehicle,
} from "../handlers/vehicles";

const vehicleRouter = Router();

vehicleRouter.get("/", getVehicles);

vehicleRouter.get("/:vehicleId", getVehicle);

vehicleRouter.post("/search", searchVehicles);

vehicleRouter.post("/", postVehicle);

vehicleRouter.post("/like-vehicle", likeVehicle);

vehicleRouter.put("/:id", updateVehicle);

vehicleRouter.delete("/:id", deleteVehicle);

export default vehicleRouter;
