

const userReducer = (state = { user: {}, favorites: [], reviews: [], userSummonerName:''}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UNSET_USER':
      return { ...state, user: {} };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload }
    case 'SET_USER_REVIEWS':
      return { ...state, reviews: action.payload }
    default:
      return state;
  }
};

// user will be on the redux state at: state.user
// In 
export default userReducer;
