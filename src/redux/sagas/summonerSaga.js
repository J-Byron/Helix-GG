// *----------* Axios *----------*
import axios from 'axios';

// *----------* Saga *----------*
import { put as dispatch, takeLatest, takeEvery } from 'redux-saga/effects';

function* fetchSummoner(action) {
    try {
        // Prepare data for request
        const summonerName = action.payload.summonerName;
        const region = action.payload.region;

        // Request sent to summoner API to query riot games API with summoner name
        const summonerResponseData = yield axios.get(`/api/summoner/${region}/${summonerName}`)

        // Also dispatch action to FETCH_SUMMONER_HISTORY.
        // This will in turn dispatch history results to summonerReducer
        yield dispatch(
            {
            type:'FETCH_SUMMONER_HISTORY',
            payload:{
                summonerName: summonerName,
                region: region,
                queueType: 'Normal' // Default
                }
            })

        // Dispatch returned summoner to summonerReducer
        yield dispatch({ type: 'SET_SUMMONER', payload: summonerResponseData })

    } catch (error) {
        console.log(`Summoner get request failed:`, error);
    }
}

function* fetchSummonerHistory(action) {
    try {
        console.log('Fetch summoner history');
        // Prepare data for request
        const summonerName = action.payload.summonerName;
        const region = action.payload.region;
        const queueType = action.payload.queueType

        // Request server to query riot games API with summoner name from client
        const summonerHistoryResponseData = yield axios.get(`/api/summoner/${region}/${summonerName}/${queueType}`)

        // Dispatch returned summoner to summonerReducer
        yield dispatch({ type: 'SET_SUMMONER_HISTORY', payload: summonerHistoryResponseData })
    } catch (error) {
        console.log(`SummonerHistory get request failed:`, error);
    }
}

function* summonerSaga() {
    yield takeEvery('FETCH_SUMMONER', fetchSummoner);
    yield takeLatest('FETCH_SUMMONER_HISTORY', fetchSummonerHistory);
}


export default summonerSaga;