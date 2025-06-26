import { Request, Response } from "express";
import { getProfileAlbumArts } from "./service";

export const getAlbumArts = async (req: Request, res: Response) => {
  try {
    const albumArts = await getProfileAlbumArts();
    res.json({ albumArts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch album arts" });
  }
};
