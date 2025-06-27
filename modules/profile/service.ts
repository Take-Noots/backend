import { fetchAlbumArtsFromSpotify } from "./repository";
import { AlbumArt } from "./model";

export const getProfileAlbumArts = async (): Promise<AlbumArt[]> => {
  // Add any business logic here if needed
  return fetchAlbumArtsFromSpotify();
};
