import { type Response, type Request } from "express";
import db from "../db";
import type Like from "../types/Likes";
import type Vehicle from "../types/Vehicle";

export async function getVehicles(req: Request, res: Response<Vehicle[]>) {
  try {
    const vehicles: Vehicle[] = (await db.query("SELECT * FROM vehicles")).rows;

    res.status(200).json(vehicles);
  } catch (err) {
    console.log(err);
  }
}

export async function getVehicle(
  req: Request<{ vehicleId: string }, {}, { userId?: number }>,
  res: Response<Vehicle>
) {
  try {
    const { vehicleId } = req.params;
    const userId = req.body.userId;

    const vehicle: Vehicle = (
      await db.query(`SELECT * FROM vehicles WHERE id = ${vehicleId}`)
    ).rows[0];

    if (userId) {
      const vehicleViewed = (
        await db.query(
          `SELECT * FROM vehicle_views WHERE user_id = ${userId} AND vehicle_id = ${vehicleId}`
        )
      ).rowCount;

      if (!vehicleViewed)
        await db.query(
          `INSERT INTO vehicle_views (user_id, vehicle_id) VALUES($1, $2)`,
          [userId, vehicleId]
        );
    }
    res.status(200).json(vehicle);
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
}

export async function postVehicle(
  req: Request<{}, {}, Vehicle>,
  res: Response
) {
  try {
    const { title, loc, price, img } = req.body;
    await db.query(
      `INSERT INTO vehicles (title, loc, price, img) VALUES($1, $2, $3, $4)`,
      [title, loc, price, img]
    );

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
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
    console.log(err);
  }
}

export async function updateVehicle(
  req: Request<{ id: string }, {}, Vehicle>,
  res: Response
) {
  try {
    const { id } = req.params;
    const { title, loc, price, img } = req.body;

    await db.query(
      `
      UPDATE vehicles SET 
        title = $1,
        loc = $2,
        price = $3,
        img = $4
      WHERE id = $5
    `,
      [title, loc, price, img, id]
    );

    res.status(200).json({ message: "success" });
  } catch (err) {
    console.log(err);
  }
}