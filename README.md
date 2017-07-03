# TravelDiary
An online noticeboard to be used for regulating announcements and academic materials for a class

## Overview

This project is made as a part of the induction procedure of Spider, the R&D club of NIT Trichy. An online travel diary where:

- An user has to be registered and logged in to use the app
- One can choose a location from a map and create journals, which can include header of the journal, the text-content, an image and links as footnotes.
- One can view all the posts which are public in nature, like and comment on it.
- One can search for users and view his posts in a single page.
- One can select a particular location and view all the public journals created within 500kms of the selected spot.
- The results of the above feature can be sorted by number of votes or the time of creation.

## Server routes(GET)

###### Public routes 

- ```/signup```  Signing up users
- ```/login```  For logging users in

###### Routes for registered users, the ones logged in

- `/dashboard` The page, which serves almost all the functionality mentioned above.
- `/serve_json` Used to serve json data for purposes listed below
  - `/uname_suggestion` takes input data and sends a maximum of 5 suitable name for suggestion
  - `/user_journals/<username>` Returns all public journals by `username`
  - `/public_journals` Return public journals
  - `/nearby_journals` Takes a location from the user and return list of public journals with 500kms of that place
  

## Server routes(POST)

###### Public routes:

- ```/signup```  For signing up users
- ```/login```  For logging users in

###### Routes for registered users, the ones logged in

- `/dashboard` To save a new journal
- `/serve_json/` Used to serve json data for purposed listed below
  - `/journal_details` Returns all journals from a particular location
  - `/journal_single_details` Returns a single journal matching with the id sent through the post request
- `/stats` to collect or edit likes and comments of a Journal
  - `/add_like` Add like to a journal
  - `/add_comment` Add comment to a journal


## Collections(MongoDB)

###### User

An User has the following fields

- username
- password
- Journals

In ```mongoose``` ( a middleware to interact with ```MongoDB``` from ```Node JS``` ), above collection can be modelled in the following way.

```javascript
var User = mongoose.model('user', new Schema({
	username: String ,
	password: String ,
	journals: Array
}))
```

###### Journal

A Journal has the following fields

- header
- content
- position
- type
- author
- date
- links
- image
- votes
- comments

In ```mongoose```, above collection can be modelled in the following way.

```javascript
var Journal = mongoose.model('journal', new Schema({
	header:String,
	content: String,
	position: String,
	type: String,
	author: String,
	date: Date,
	links : Array,
	image: String,
	votes: {number: Number, users: Array},
	comments: Array
}))
```

## Build Instructions (For Linux[Tested with Ubuntu 16.04])

###### **Packages Installation**
1. **Node JS**	     
A Javascript runtime for running our server code.
	
	``` 
	curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
	sudo apt-get install -y nodejs
	```

2. **NPM**(Node Package Manager)\
	A package manager for easy installation of dependencies. It is automatically installed along with NodeJS.
	
	``` 
	sudo apt update
	sudo apt install npm 
	```

3. **MongoDB**(The database)\
	This process requires some documented and comprehensive guide. Please refer to these blogs(preferably, the first one), for installation of `MongoDB`
	- [MongoDB official website docs](https://docs.mongodb.com/master/tutorial/install-mongodb-on-ubuntu/)
	
	- [howtoforge](https://www.howtoforge.com/tutorial/install-mongodb-on-ubuntu-16.04/)
	
	

###### Database setup
1. Open mongo shell by typing
	```
	mongo
	```
	in Terminal.
2. In the shell, create a database named `noticeboard` by typing
	```
	use noticeboard
	```
3. Create the first `Administrator` by typing
	```
	db.users.insert({username: admin, password:'$2a$10$JePpGspbJohVb1THFEtHMeIsJgje4vp72G0GQFD2WzVxrFPtpV4ay',type: 'teacher',moderated:'false'})
	```
	which creates an User with `username: 'admin'` and `password:'helloFriend'`
	

###### Server setup

1. Clone this project to a suitable directory using
	```
	git clone https://github.com/shivPadhi/Noticeboard.git
	```

2. Make sure the Mongo DB server is running. Or type the following command
	```
	sudo service mongod start
	```
3. - Go to the directory and run the server using

	```
	nodejs app.js
	```
	in the `terminal`.
   - (or) An efficient method to run Node JS servers is with [Nodemon](https://nodemon.io/)
   
	```
	npm install -g nodemon
	```
	Now everytime a component of the server is changed, `Nodemon` restarts your server. To run a server with Nodemn instead 	of `nodejs app.js` type:
	```
	nodemon app.js
	```


## Dependencies 

- [Express](http://expressjs.com/)
	A framework written over Node JS.
- [Body-Parser](https://www.npmjs.com/package/body-parser)
	Middleware to parse request body
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
	Middleware to parse cookies
- [express-fileupload](https://www.npmjs.com/package/express-fileupload)
	Middleware to handle file uploads.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
	Middleware to generate and verify web-tokens.
- [mongoose](https://www.npmjs.com/package/mongoose)
	Library to interact efficiently with MongoDB
- [nodemon](https://www.npmjs.com/package/nodemon)
	Keeps track of file-changes and restarts server after every change in server cde
- [path](https://nodejs.org/api/path.html)
	Helps merging paths efficiently
- [morgan]()
	Helps to log requests details to console
- [bcrypt](https://www.npmjs.com/package/bcrypt)
	Helps to hash passwords and compare them when requested.
- [captchapng](https://www.npmjs.com/package/captchapng)
	Generates png captcha image of numbers having arbitrary shapes and positions.
- [request](https://www.npmjs.com/package/request)
  Helps easy sending and handling http requests to another server.
- **This list doesn't include the sub-dependencies required by above libraries, they are auto-generated**
## Front-End libraries

- [jQuery](http://api.jquery.com/) Library for javaScript
- [jQuery-cookie](https://github.com/carhartl/jquery-cookie) Library to set, get, modify and delete cookies with jQuery.
- [js-cookie](https://www.npmjs.com/package/js-cookie) Easing cookie set, get, modify and delete options.


## Pending tasks(Top 3)

- [ ] Convert fulltime to just the date, while saving a new Journal
- [ ] Verify file type before uploading to server
- [ ] Make the layouts responsive

## Demo Server
A server for the above app is running live at [`this place`](http://139.59.255.96:3000)
