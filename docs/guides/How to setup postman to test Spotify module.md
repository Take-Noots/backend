This doc will go through the current process to test spotify module endpoints using postman. It is assumed that you have a workspace set up with an collection to store requests. It is also assumed that the back-end is up and running through out this process.

## Getting Started

**Step 1** : Go to `localhost:3000/spotify/login` in your browser. Log into your spotify account and make sure to agree to what spotify asks Noot to be able to do. Once done you will see a json with following format

```
{
"access_token" : "<your-access-token>",
"refresh_token" : "<your-refresh-token>",
"expires_in" : 3600
}
```

Make sure to copy the string given in refresh_token

**Step 2** : Create a new **GET HTTP request** (preferably named "Refresh") with the URL `localhost:3000/spotify/refresh` . 

**Step 3** : Navigate to cookies menu (should be somewhere in top right with "cookies" written in blue). Add a new domain called `localhost:3000`. Once the domain localhost is created, create a new cookie by clicking "Add cookie"  

**Step 4** : Currently you cookie creation thingie will look something like this

```
Cookie_1=value; Path=/; Expires=Tue, 09 Jun 2026 22:14:49 GMT;
```

Replace the cookie name to "spotify_refresh_token" and the cookie value to the refresh token you copied from the browser. Once done it should look something like

```
spotify_refresh_token=<yout-refresh-token>; Path=/; Expires=Tue, 09 Jun 2026 22:14:49 GMT;
```

Once done save the cookie and exit the cookie menu

**Step 5** :  In your top right you will see a environment tab (Will have a drop down with "no environment" or something). Click the drop down and click the "+" to create a new environment. Here add a new variable called "spotify_access_token" (you do not need to give it a Initial Value or Current Value at this moment). Make sure you have this New Environment in the Environment drop down each time you work.

**Step 6** : In your Refresh Request, You will see a "Script" Tab (will be alongside Params, Authorization, Headers, Body tabs). Make sure to have the following code in the "Post-response" of Script tab

```
let accessToken = pm.response.headers.get("x-spotify-token");
pm.environment.set("spotify_access_token", accessToken);
```

**Step 7** : Now your all set!! Click send and you should a Response with status 200 and a json body saying

```
{
"message": "Refresh was successful"
}
```

If you don't, Either you fucked up or i fucked up in explaining the process up to this point. Either way better contact me

If all went alright, Now you have an access token (It's currently in your environment variables)and can now access almost all of the current spotify module endpoints we have created. To test this let's start off with a simple call.

## Who Am I

I will use `localhost:3000/spotify/whoami` to elaborate how this will work. Its a simple endpoint used to get the username of the spotify user that's connected to Noot

**Step 1** : Create a new **GET HTTP Request** (preferably named "Get Username") with the URL `localhost:3000/spotify/whoami` . In the "Headers" tab (Will be alongside Params, Authorization tabs), Create a new header by giving the following values to a row.
- Key = `x-spotify-token`
- Value = `{{spotify_access_token}}`

Step 2 : Make sure you have the correct environment selected in the environment drop down and Click Send. If all goes well you should see a response with a status "200" and your username as a string in response body