import axios from 'axios';
import { put as dispatch, takeLatest } from 'redux-saga/effects';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information

    // from the server session (req.user)
    const response = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield dispatch({ type: 'SET_USER', payload: response.data });

    // After user signed in, fetch all user data
    yield dispatch({type:'FETCH_FAVORITES', payload: response.data.id});
    yield dispatch({ type: 'FETCH_USER_REVIEWS', payload: response.data.id})



  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchUserProfile(){
  
}

// Post a review under user
function* postReview(action){
  try {

    // Destructure data from payload
    const {summonerName, id, rating, reviewContent} = action.payload;

    // Send request to API
    yield axios.post('/api/user/review', {summonerName, id, rating, reviewContent})

    // Notify user of success/failure


    // Update user reviews
    yield dispatch({ type: 'FETCH_USER_REVIEWS', payload:id})

    // Update summoner Reviews
    yield dispatch({type:'FETCH_SUMMONER_REVIEWS', payload:summonerName})

    // console.log(rating,reviewContent,summonerName);

  } catch (error) {
    console.log(`Error in postReview`, error);
  }
}

function* deleteUserReview(action){
  try {

    const {userId, reviewId} = action.payload;

    // Dispatch request to delete review from DB
    yield axios.delete(`/api/user/delete/${reviewId}`);

    // Update redux
    yield dispatch({ type: 'FETCH_USER_REVIEWS', payload:userId})

  } catch (error) {
    console.log('Error in deleteUserReview: ', error);
  }
}

// Fetch user's reviews
function* fetchUserReviews(action){
  try {

    const id = action.payload;

    // pass query params to API call
    const reviewRespnse = yield axios.get(`/api/user/${id}/reviews`);

    yield dispatch({
      type: 'SET_USER_REVIEWS',
      payload: reviewRespnse.data
    })

  } catch (error) {
    console.log(`Error in fetchUserReviews:`, error);
  }
}

// Post a favorite for current user
function* postFavoriteSummoner(action){
  try {

    console.log(action.payload);
    
    // Data from action
    const {userId, summonerName, profileIcon} = action.payload;

    // post data to ../../favorite endpoint
    yield axios.post('/api/user/favorite', {userId, summonerName, profileIcon})

    // notify user of update (?)

    // Dispatch to fetch favorites
    yield dispatch({type:'FETCH_FAVORITES',payload: userId})

  } catch (error) {
    console.log(`Error in postFavoriteSummoner:`, error);
  }
}

// Fetch a user's favorite summoners
function* fetchFavorites(action){
  try {

    //
    const userId = action.payload;

    //
    const favoritesResponse = yield axios.get(`/api/user/${userId}/favorites`);

    const favorites = favoritesResponse.data;

    console.log(favorites);

    //
    yield dispatch({type:'SET_FAVORITES',payload: favorites});

  } catch (error) {
    console.log(`Error in fetchFavorites:`, error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_USER_PROFILE', fetchUserProfile);

  yield takeLatest('POST_REVIEW', postReview);
  yield takeLatest('DELETE_USER_REVIEW', deleteUserReview)
  yield takeLatest('FETCH_USER_REVIEWS', fetchUserReviews);

  yield takeLatest('POST_FAVORITE_SUMMONER', postFavoriteSummoner);
  yield takeLatest('FETCH_FAVORITES', fetchFavorites);
}

export default userSaga;
