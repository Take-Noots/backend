Suggested enpoints

POST	/api/v1/content/posts	            Create new post
GET	    /api/v1/content/posts/:id	        Get specific post
PUT	    /api/v1/content/posts/:id	        Update post
DELETE	/api/v1/content/posts/:id	        Delete post
POST	/api/v1/content/posts/:id/like	    Like/unlike post
POST	/api/v1/content/posts/:id/share	    Share post
GET	    /api/v1/content/posts/:id/comments	Get post comments
POST	/api/v1/content/posts/:id/comments	Add comment
PUT	    /api/v1/content/comments/:id	    Update comment
DELETE	/api/v1/content/comments/:id	    Delete comment
GET	    /api/v1/content/fanbases	        Get all fanbases
POST	/api/v1/content/fanbases	        Create fanbase
GET	    /api/v1/content/fanbases/:id	    Get fanbase details
POST	/api/v1/content/fanbases/:id/join	Join fanbase
DELETE	/api/v1/content/fanbases/:id/leave	Leave fanbase
GET	    /api/v1/content/songs/:id/posts	Get posts for specific song