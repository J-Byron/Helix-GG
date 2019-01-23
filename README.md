# Helix.GG

Helix.GG is a companion application for [league of legends](https://na.leagueoflegends.com/en/) that allows users to search for other players and 
view statistics and reviews left by other players.

## Built with

* javaScript
* Node
* React
* React-redux
* redux-saga
* Passport
* Express
* SQL
* CSS3
* HTML5
* Nivo (D3)

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en/)
- [PostrgeSQL](https://www.postgresql.org/)
- [Nodemon](https://nodemon.io/)

## Installing

Create a new database called `helix` and create the following tables:

```SQL

CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (255) UNIQUE NOT NULL,
    "password" VARCHAR (255) NOT NULL,
    "summoner_Name" VARCHAR(255),
    "profile_icon" VARCHAR(255),
    "email_address" VARCHAR(255)
);

CREATE TABLE "Review" (
    "id" SERIAL PRIMARY KEY,
    "reviewed_summonerName" VARCHAR(255) NOT NULL,
    "reviewing_user_id" INT REFERENCES "User" NOT NULL,
    "rating" INT NOT NULL,
    "content" VARCHAR(160) -- Could be null if user just wants to leave a rating
);

CREATE TABLE "Favorite" (
    "id" SERIAL PRIMARY KEY,
    "summoner_Name" VARCHAR(255) NOT NULL,
    "user_id" INT REFERENCES "User",
    "summoner_profile_icon" VARCHAR(255)
);

```

If you would like to name your database something else, you will need to change `helix` to the name of your new database name in `server/modules/pool.js`

* Run `npm install`
* Create a `.env` file at the root of the project and paste this line into the file:
    ```
    SERVER_SESSION_SECRET=superDuperSecret
    ```
    While you're in your new `.env` file, take the time to replace `superDuperSecret` with some long random string like `25POUbVtx6RKVNWszd9ERB9Bb6` to keep your application secure. Here's a site that can help you: [https://passwordsgenerator.net/](https://passwordsgenerator.net/). If you don't do this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you will get a warning.

* Signup for a riot games [api key](https://developer.riotgames.com/) and paste this line into your `.env` file
    ```
    API_KEY= <your api key>
    ```

* Start postgres if not running already by using `brew services start postgresql`
* Run `npm run server`
* Run `npm run client`
* Navigate to `localhost:3000`

## Screenshots

<img src="screenshots/Screen Shot 2019-01-22 at 2.26.54 PM.png" width=100%>

<img src="screenshots/Screen Shot 2019-01-22 at 2.29.18 PM.png" width=100%>

<img src="screenshots/Screen Shot 2019-01-22 at 2.30.04 PM.png" width=100%>


## Documentation

Link to the scoping document for this project can be found [here](https://docs.google.com/document/d/1XGW9mQGWjWU5vHliDaz_XBNMuAl59HCbc_YlSpO7PJk/edit?usp=sharing).

## Completed features

- [x] Home Page UI
- [x] Routes
- [x] Search bar 
- [x] Summoner Profile
- [x] Summoner profile reviews
- [x] Summoner profile create review
- [x] Favorite summoner
- [x] Summoner Profile analytics
- [x] Summoner Profile recent champs analytics
- [x] Summoner Profile match history
- [x] User login and authorization
- [x] User registration
- [x] Summoner / User reviews
- [x] Profile Page
- [x] Display/Edit/Delete user reviews
- [x] Display/Delete favorites
- [x] UI Transitions


## Next Steps

Here are some features I plan on implementing in the near future

- [ ] Additional detail to profile summary
- [ ] Table row on mount transitions
- [ ] Page lifecycle animations
- [ ] Refractor searching to allow 20+ searchs in parallel 
- [ ] Refractor searching to be made on click of summoner name
- [ ] Search bar visible on all pages
- [ ] Display chart of summoner's ratings
- [ ] Migrate to mobile
- [ ] Account verification (?)
- [ ] Email verification
- [ ] Success/error notifications & snackbars & 
- [ ] Comprehensive overhaul of analytics
- [ ] Champion Wallpaper
- [ ] Update animation / color scheme / layout to be more user friendly 

## Authors

- Josh Byron

## Production Build

Before pushing to Heroku, run `npm run build` in terminal. This will create a build folder that contains the code Heroku will be pointed at. You can test this build by typing `npm start`. Keep in mind that `npm start` will let you preview the production build but will **not** auto update.

* Start postgres if not running already by using `brew services start postgresql`
* Run `npm start`
* Navigate to `localhost:5000`

1. Create a new Heroku project
1. Link the Heroku project to the project GitHub Repo
1. Create an Heroku Postgres database
1. Connect to the Heroku Postgres database from Postico
1. Create the necessary tables
1. Add an environment variable for `SERVER_SESSION_SECRET` with a nice random string for security
1. In the deploy section, select manual deploy