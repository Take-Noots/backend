I am surprised you are even reading this. 

# Authentication
## \[ GET ] Login

A work in progress

## \[ GET ] Refresh

### URL 

```
localhost:3000/spotify/refresh
```

### Request

- Requires to have `spotify_refresh_token` cookie with spotify refresh token in its value

### Response

If successful
- Body says "Refresh was successfull"
- Receive a `x-spotify-token` header containing the spotify access token


---
# User
## \[ GET ] Get Username

### URL

```
localhost:3000/spotify/whoami
```

### Request

Requires you to have
- `x-spotify-token` with spotify access token as its value in the request header

### Response

Sends a string containing the username of the current spotify account connected to Noot


---
# Search
## \[ GET ] Search Track

### URL

```
localhost:3000/spotify/search
```

### Requests

This endpoint given a track name returns a search result. Hence it requires you to send a search query as `track_name` in body of request

```
{
"track_name": "bluestar"
}
```

Along with this you are also required to send `x-spotify-token` header containing spotify access token

### Response

You will receive a list of tracks that matched your search request (limited to only sending the first 10 tracks that matched) within response body as follows

```
{
"tracks": {
	"href": "https://api.spotify.com/v1/search?offset=0&limit=10&query=track%3Abluestar&type=track",
	"limit": 10,
	"next": "https://api.spotify.com/v1/search?offset=10&limit=10&query=track%3Abluestar&type=track",
	"offset": 0,
	"previous": null,
	"total": 100,
	"items": [
		{
		"id": "6K6wDKxAKY3yRoWnf7O2fT",
		"name": "BLUESTAR",
		"artists": [
		"Pretty Patterns",
		"TOFIE"
		],
		"album": "BLUESTAR"
		}, .......
```


## \[ GET ] Search Artists Famous Tracks

This endpoint allows you to retrieve a list of most famous tracks of an artist

### URL

```
localhost:3000/spotify/search-artists-famous-tracks
```

### Request

Requires you to send a artist name as `artist_name` in body of request

```
{
	"artist_name": "Pretty Patterns"
}
```

Along with this you are also required to send `x-spotify-token` header containing spotify access token

### Response

Receive a list of tracks in body of response as follows

```
{
	"tracks": [
		{
			"album": {
			"album_type": "single",
			"artists": [
				{
					"external_urls": {
					"spotify": "https://open.spotify.com/artist/4qwvSfN4vvXmOfepMFSCeX"
					},
					"href": "https://api.spotify.com/v1/artists/4qwvSfN4vvXmOfepMFSCeX",
					"id": "4qwvSfN4vvXmOfepMFSCeX",
					"name": "Pretty Patterns",
					"type": "artist",
					"uri": "spotify:artist:4qwvSfN4vvXmOfepMFSCeX"
				}
			], .....
```


---
# Player

## \[ GET ] Get Current Track

This endpoint allows you to retrieve the current track that's being played by spotify

### URL

```
localhost:3000/spotify/current-track
```

### Request

 You are required to send `x-spotify-token` header containing spotify access token

### Response

Receives a response with json body containing details needed 

```
{
	"is_playing": true,
	"track": {
		"name": "BLUESTAR",
		"artists": [
		"Pretty Patterns",
		"TOFIE"
	],
	"album": "BLUESTAR",
	"duration_ms": 308000,
	"progress_ms": 119110,
	"is_playing": true
	}
}
```

If nothing is currently being played on Spotify you will receive

```
{
	"is_playing": false
}
```

## \[ PUT ] Play Specific Track

This endpoint allows you to play a track (specified by giving the relevant track Id)

### URL

```
localhost:3000/spotify/play
```

### Request

Requires you to send the track id within response body as below

```
{
	"track_id" : "6K6wDKxAKY3yRoWnf7O2fT"
}
```

Additionally you can also specify from what point the track should start from by defining `track_position`. The value defined by `track_position` shifts the starting point of the track to specified location (measured in ms). If Defined the Request body would look something like below

```
{
	"track_id" : "6K6wDKxAKY3yRoWnf7O2fT",
	"track_position" : 34000
}
```

Along with this you are also required to send `x-spotify-token` header containing spotify access token

### Response

If successful, The song you requested will start playing through spotify and you will recieve a response with status code 200 and a body

```
{
	"is_playing": true
}
```