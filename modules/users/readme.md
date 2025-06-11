Suggested Endpoints

POST	/api/v1/users/auth/login	    Spotify OAuth login
POST	/api/v1/users/auth/refresh	    Refresh JWT token
GET	    /api/v1/users/profile/:id	    Get user profile
PUT	    /api/v1/users/profile	        Update user profile
POST	/api/v1/users/follow/:userId	Follow user
DELETE	/api/v1/users/unfollow/:userId	Unfollow user
GET	    /api/v1/users/followers/:userId	Get followers list
GET	    /api/v1/users/following/:userId	Get following list
GET	    /api/v1/users/suggestions	    Get follow suggestions
GET	    /api/v1/users/spectrum/:userId	Get user's music spectrum