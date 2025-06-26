import { AlbumArt } from "./model";

// This would normally call Spotify API. Here, we mock it.
export const fetchAlbumArtsFromSpotify = async (): Promise<AlbumArt[]> => {
  // Replace with real Spotify API call and authentication
  return [
    { url: "https://i.scdn.co/image/ab67616d0000b273e0e0e0e0e0e0e0e0e0e0e0e0" },
    { url: "https://i.scdn.co/image/ab67616d0000b273f1f1f1f1f1f1f1f1f1f1f1f1" },
    { url: "https://i.scdn.co/image/ab67616d0000b273a2a2a2a2a2a2a2a2a2a2a2a2" },
    { url: "https://i.scdn.co/image/ab67616d0000b273b3b3b3b3b3b3b3b3b3b3b3b3" },
    { url: "https://i.scdn.co/image/ab67616d0000b273c4c4c4c4c4c4c4c4c4c4c4c4" },
  ];
};
