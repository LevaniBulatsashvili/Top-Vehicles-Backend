import { type Response, type Request } from "express";
import db from "../db";
import type Like from "../types/Likes";
import type Vehicle from "../types/Vehicle";
import handleHttpErrors from "../util/handleHttpErrors";

export async function getVehicles(req: Request, res: Response<Vehicle[]>) {
  try {
    const vehicles: Vehicle[] = (await db.query("SELECT * FROM vehicles")).rows;

    res.status(200).json(vehicles);
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function getVehicle(
  req: Request<{ vehicleId: string }, {}, { userId?: number }>,
  res: Response<Vehicle>
) {
  try {
    const { vehicleId } = req.params;
    const userId = req.body.userId;

    const vehicle: Vehicle | undefined = (
      await db.query(`SELECT * FROM vehicles WHERE id = ${vehicleId}`)
    ).rows[0];

    if (vehicle && userId) {
      const vehicleViewed = (
        await db.query(
          `SELECT * FROM vehicle_views WHERE user_id = ${userId} AND vehicle_id = ${vehicleId}`
        )
      ).rowCount;

      if (!vehicleViewed) {
        await db.query(
          `INSERT INTO vehicle_views (user_id, vehicle_id) VALUES($1, $2)`,
          [userId, vehicleId]
        );
      }
    }

    if (vehicle) res.status(200).json(vehicle);
    else res.status(404);
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function searchVehicles(
  req: Request<{}, {}, { title: string }>,
  res: Response<Vehicle[]>
) {
  try {
    const { title } = req.body;
    const vehicles: Vehicle[] = (
      await db.query(`SELECT * FROM vehicles WHERE title ILIKE '%${title}%'`)
    ).rows;

    res.status(200).json(vehicles);
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function postVehicle(
  req: Request<{}, {}, Vehicle>,
  res: Response<Vehicle>
) {
  try {
    const { user_id, title, description, loc, price, img } = req.body;
    const vehicle: Vehicle = (
      await db.query(
        `INSERT INTO vehicles (user_id, title, description, loc, price, img) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, title, description, loc, price, img]
      )
    ).rows[0];

    res.status(201).json(vehicle);
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function likeVehicle(req: Request<{}, {}, Like>, res: Response) {
  try {
    const { userId, vehicleId } = req.body;
    const vehicleLiked = (
      await db.query(
        `SELECT * FROM vehicle_likes WHERE user_id = ${userId} AND vehicle_id = ${vehicleId}`
      )
    ).rowCount;

    if (!vehicleLiked)
      await db.query(
        `INSERT INTO vehicle_likes (user_id, vehicle_id) VALUES($1, $2)`,
        [userId, vehicleId]
      );
    else
      await db.query(
        `DELETE FROM vehicle_likes WHERE user_id = $1 AND vehicle_id = $2`,
        [userId, vehicleId]
      );

    res.status(200).json({ message: "success" });
  } catch (err) {
    handleHttpErrors(res, err);
  }
}

export async function updateVehicle(
  req: Request<{ id: string }, {}, Vehicle>,
  res: Response<Vehicle>
) {
  try {
    const { id } = req.params;
    const { user_id, title, description, loc, price, img } = req.body;

    const vehicle: Vehicle = (
      await db.query(
        `
      UPDATE vehicles SET 
        user_id = $1,
        title = $2,
        description = $3,
        loc = $4,
        price = $5,
        img = $6
      WHERE id = $7
      RETURNING *
    `,
        [user_id, title, description, loc, price, img, id]
      )
    ).rows[0];

    res.status(200).json(vehicle);
  } catch (err) {
    handleHttpErrors(res, err);
  }
}
