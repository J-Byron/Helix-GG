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
router.post('/favorite', (req,res)=>{
  const {summonerName, userId, profileIcon} = req.body;

  const queryString = `INSERT INTO "Favorite" ("user_id","summoner_Name","summoner_profile_icon") VALUES ($1,$2,$3);`;

  pool.query(queryString, [userId,summonerName, profileIcon]).then(result=>{
    res.sendStatus(204);
  }).catch(err =>{
    console.log(`Error in post ../user/favorites: ${err}`);
    res.sendStatus(500);
  })
})

//
router.get('/:id/favorites', (req,res) =>{
  const userId = req.params.id;
  const queryString = `SELECT "id","user_id","summoner_Name","summoner_profile_icon" FROM "Favorite" where "user_id" = $1 ORDER BY "id" DESC;`;

  pool.query(queryString, [userId]).then(result =>{
    res.send(result.rows);
  }).catch(err =>{
    console.log(`Error in  get ../user/id/favorites: ${err}`);
    res.sendStatus(500);
  })
})

router.delete('/favorite/delete/:id',(req,res)=>{
  //
  const {id} = req.params;
  
  //
  const queryString = 'DELETE FROM "Favorite" WHERE id=$1;';

  pool.query(queryString,[id])
  .then(result => res.sendStatus(204))
  .catch(error=>{
    console.log(`Error in /api/user/favorite/delete/:id: ${error}`);
  })
})

//
router.post('/review',(req,res)=>{

  // Destructure content of req.body
  const {summonerName, id, rating, reviewContent} = req.body;

  // Create SQL query string
  const queryString = 'INSERT INTO "Review" ("reviewed_summonerName","reviewing_user_id","rating","content") VALUES ($1,$2,$3,$4);';

  // Post data to database and handle error
  pool.query(queryString,[summonerName, id, rating, reviewContent])
  .then(()=>{
    res.sendStatus(204)
  }).catch(err=>{
    console.log(`Error in post ../user/review: ${err}`);
    res.sendStatus(500);
  })

})

//
router.get('/:id/reviews', (req,res) => {
  //
  const userId = req.params.id;

  //
  const queryString = `SELECT * FROM "Review" where "reviewing_user_id" = $1 ORDER BY "id" DESC;`;

  //
  pool.query(queryString, [userId]).then(result =>{
    res.send(result.rows);
  }).catch(err =>{
    console.log(`Error in  get ../user/id/reviews: ${err}`);
    res.sendStatus(500);
  })
})

//
router.put('/review', (req,res)=>{

  // Deconstruct
  const {reviewContent, reviewId, reviewRating} = req.body;

  //
  const queryString = `UPDATE "Review" 
                       SET "rating" = $1, "content" = $2
                       WHERE "id" = $3;`;

  pool.query(queryString,[reviewRating, reviewContent, reviewId])
  .then(result=>{
    res.sendStatus(204);
  })
  .catch(err=>{
    console.log(`Error in PUT api/user/review: ${err}`);
  })
});

// yield axios.delete(`/api/user/delete/${reviewId}`);
router.delete('/delete/:reviewId', (req,res)=>{
  const reviewId = req.params.reviewId;
  const queryString = 'DELETE FROM "Review" WHERE id=$1;';

  pool.query(queryString,[reviewId]).then(result=>{
    res.sendStatus(204);
  }).catch(error=>{
    console.log(`Erro in user/delete/:reviewId: `, error);
    res.sendStatus(500);
  })
})

module.exports = router;
