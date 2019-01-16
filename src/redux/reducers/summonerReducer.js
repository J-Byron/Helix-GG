
// Going to need to trim summoner data somewhere


const summonerReducer = (state = {summoner:{},summonerHistory:{}, reviews:[], isLoaded: false}, action) => {
    switch (action.type) {
      case 'SET_SUMMONER':
        return {...state, summoner: action.payload} ;
      case 'SET_SUMMONER_HISTORY':
        return {...state, summonerHistory: action.payload, isLoaded: true}
      case 'RESET_DATA':
        return {summoner:{},summonerHistory:{}, reviews:[], isLoaded: false}
      case 'SET_SUMMONER_REVIEWS':
        return {...state, reviews: action.payload}
      default:
        return state;
    }
  };

  export default summonerReducer;
  