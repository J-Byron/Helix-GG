// *----------* Axios *----------*
import axios from 'axios';

// *----------* Saga *----------*
import { put as dispatch, takeLatest, takeEvery } from 'redux-saga/effects';

// *----------*  *----------*
function* fetchSummoner(action) {
    try {
        // TODO PUSH TO LOADING SCREEN

        // Reset Data
        yield dispatch({type:'RESET_DATA'})

        // Prepare data for request
        const summonerName = action.payload.summonerName;
        const region = action.payload.region;

        // Request sent to summoner API to query riot games API with summoner name
        const { data : summonerResponseData} = yield axios.get(`/api/summoner/${region}/${summonerName}`);

        // Fetch reviews about summoner
        yield dispatch({type:'FETCH_SUMMONER_REVIEWS', payload: summonerName})

        // Also dispatch action to FETCH_SUMMONER_HISTORY.
        // This will in turn dispatch history results to summonerReducer
        yield dispatch (
            {
            type:'FETCH_SUMMONER_HISTORY',
            payload:{
                summonerName: summonerName,
                region: region,
                queueType: 'Normal', // Default
                // history: action.payload.history
                },
            history: action.history
            }
        )


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
        const { data : summonerHistoryResponse} = yield axios.get(`/api/summoner/${region}/${summonerName}/${queueType}`)

        // Dispatch returned summoner to summonerReducer
        yield dispatch({ type: 'SET_SUMMONER_HISTORY', payload: summonerHistoryResponse })

        //
        yield action.history.push(`/search/summonerName=${summonerName}`);

    } catch (error) {
        console.log(`SummonerHistory get request failed:`, error);
    }
}

//
function* fetchSummonerReviews(action){
try {

    //
    const summonerName = action.payload;
    console.log(summonerName);

    // Make request to API to fetch all reviews of summoner
    const { data : reviewsResponse } = yield axios.get(`/api/summoner/reviews/${summonerName}`);

    // 
    yield dispatch({type:'SET_SUMMONER_REVIEWS', payload: reviewsResponse})

} catch (error) {
    
}
}

function* summonerSaga() {
    yield takeEvery('FETCH_SUMMONER', fetchSummoner);
    yield takeLatest('FETCH_SUMMONER_HISTORY', fetchSummonerHistory);
    yield takeLatest('FETCH_SUMMONER_REVIEWS', fetchSummonerReviews);
}


export default summonerSaga;