const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// *----------* Auth *----------*
// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "User" (username, password) VALUES ($1, $2) RETURNING id';
// console.log(queryText);
  pool.query(queryText, [username, password])
    .then(() => { res.sendStatus(201); })
    .catch((err) => { next(err); });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

// *----------* helix CRUD *----------*

//
router.post('/favorites', (req,res)=>{

  const summonerName = req.body.summonerName;
  const userId = req.body.userId;

  const queryString = `INSERT INTO "Favorite" ("user_id","summoner_Name") VALUES ($1,$2);`;

  pool.query(queryString, [userId,summonerName]).then(result=>{
    res.sendStatus(204);
  }).catch(err =>{
    console.log(`Error in post ../user/favorites: ${err}`);
    res.sendStatus(400);
  })
})

//
router.get('/:id/favorites', (req,res) =>{
  const userId = req.params.id;
  const queryString = `SELECT ("summoner_Name") FROM "Favorite" where "user_id" = $1;`;

  pool.query(queryString, [userId]).then(result =>{
    res.send(result.rows);
  }).catch(err =>{
    console.log(`Error in  get ../user/id/favorites: ${err}`);
    res.sendStatus(400);
  })
})

//
router.get('/:id/reviews', (req,res) => {
  const userId = req.params.id;
  const queryString = `SELECT * FROM "Review" where "reviewing_user_id" = $1;`;

  pool.query(queryString, [userId]).then(result =>{
    res.send(result.rows);
  }).catch(err =>{
    console.log(`Error in  get ../user/id/reviews: ${err}`);
    res.sendStatus(400);
  })

})

module.exports = router;
