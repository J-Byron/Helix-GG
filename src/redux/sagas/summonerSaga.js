// *----------* Axios *----------*
import axios from 'axios';

// *----------* Saga *----------*
import { put as dispatch, takeLatest } from 'redux-saga/effects';

function* fetchSummoner(action){
    try {
        // Prepare data for request
        const summonerName = action.payload.summonerName;
        const region = action.payload.region;

        // Request server to query riot games API with summoner name from client
        const summonerResponseData = yield axios.get(`/api/summoner/${region}/${summonerName}`)

        // Dispatch returned summoner to summonerReducer
        yield dispatch({type: 'SET_SUMMONER', payload:summonerResponseData})

    } catch (error) {
        console.log(`Summoner get request failed:`, error);
    }
}

function* summonerSaga() {
  yield takeLatest('FETCH_SUMMONER', fetchSummoner);
}

export default summonerSaga;