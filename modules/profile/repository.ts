import { AlbumArt } from "./model";

// This would normally call Spotify API. Here, we mock it.
export const fetchAlbumArtsFromSpotify = async (): Promise<AlbumArt[]> => {
  try {
    // You should implement proper authentication to get a valid token
    const token = process.env.SPOTIFY_API_TOKEN;

    // Sample album IDs - replace with your desired albums
    const albumIds = [
      "382ObEPsp2rxGrnsizN5TX",
      "1A2GTWGtFfWp7KSQTwWOyo",
      "2noRn2Aes5aoNVsU6iWThc",
    ].join(",");

    const response = await fetch(
      `https://api.spotify.com/v1/albums?ids=${encodeURIComponent(albumIds)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API returned ${response.status}`);
    }

    const data = await response.json();

    // Extract album art URLs from the response
    return data.albums
      .map((album: any) => ({
        url: album.images[0]?.url,
      }))
      .filter((art: AlbumArt) => art.url);
  } catch (error) {
    console.error("Failed to fetch album arts:", error);
    return [];
  }
};
