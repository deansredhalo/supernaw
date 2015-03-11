![Doug Supernaw](http://dougsupernaw.org/wp-content/gallery/galler1/doug_1_pg.jpg) 

# Supernaw

A command-line tool for generating living API backends for CRUD operations in Node/Express and MongoDB by importing an [API Blueprint](http://www.apiblueprint.org/ "API Blueprint") file. Supernaw is the first in my line of applications/ideas named after early 90s era country singers, this one named after Doug Supernaw, who is famous for the hit singles "Reno" and "I Don't Call Him Daddy."

## Installation

You can install Supernaw via the npm package installer, like so

	$ npm install supernaw

Once Supernaw has finished installing, you'll need to check to start the _MongoDB_ server with the path to where you want your database stored (the default is _/data_) by using the following command
	
	$ mongod --dbpath <path-of-database or simply data>

This will engage the MongoDB server and create your database. From here you are ready to use Supernaw to begin building your backends.

## Usage

To begin using Supernaw, start the application using

	$ supernaw <path-to-api-blueprint>

If you want to use the test API document that is included, you can try that out like this

```
	$ supernaw ./apis/test2.md
```

If all goes well, you should see the following message in your terminal

```
You know the lady's a lot like Reno...Supernaw is running on port 1993
```

Fire up Postman or whatever REST client you prefer and you can now begin making API CRUD calls using the prefix `http://localhost:1993/` (1993 was the year of Doug Supernaw's biggest hit, "Reno" -- FUN FACT!). The database will be empty to start, so you'll have to try doing some POSTs to populate it.

## Things to do

Thorough testing with tons of API Blueprint docs.
This thing probably needs a good refactoring/overhaul/rewrite when I'm not slammed.
Add unit tests, preferably either using Mocha or Karma.
Add custom responses from server.
