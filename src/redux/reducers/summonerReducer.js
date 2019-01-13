
// Going to need to trim summoner data somewhere


const summonerReducer = (state = {summoner:{},summonerHistory:{}}, action) => {
    switch (action.type) {
      case 'SET_SUMMONER':
        return {...state, summoner: action.payload} ;
      case 'SET_SUMMONER_HISTORY':
        return {...state, summonerHistory: action.payload}
      case 'RESET_DATA':
        return {summoner:{},summonerHistory:{}}
      default:
        return state;
    }
  };

  export default summonerReducer;
  