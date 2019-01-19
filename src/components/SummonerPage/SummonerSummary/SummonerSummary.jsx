// *----------* React App *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Page Components *----------*
// import ReviewDropDown from './ReviewDropDown/ReviewDropDown';
import SummonerReviewComponent from './SummonerReviewComponent/SummonerReviewComponent';

// *----------* Styling *----------*
import './SummonerSummary.css'

class SummonerSummary extends Component {
    state = {
        showReviewForm: false,
    }

    handleFavoriteClick = () => {
        // Send request to saga -> set favorites -> fetchFavorites
        this.props.dispatch({
            type: 'POST_FAVORITE_SUMMONER',
            payload: {
                userId: this.props.user.user.id,
                summonerName: this.props.summoner.summoner.summonerName,
                profileIcon: this.props.summoner.summoner.profileIcon,
            }
        })
    }

    canFavorite = () => {
        // If user already favorited the displayed summoner, do not give ability to favorite
        const favorites = this.props.user.favorites.map(player=>{
            return player.summoner_Name;
          });

        if ((favorites.indexOf(this.props.summoner.summoner.summonerName) > -1) && this.props.user.user.id) {
            return false
        } else if (!this.props.user.user.id) {
            return false
        }
        else {
            return true
        }
    }

    hasData = () => {
        if (this.props.summoner.summonerHistory.hasOwnProperty('matchResults')) {
            return true;
        }
        return false;
    }

    render() {

        const { wins, losses } = (this.hasData()) ? this.props.summoner.summonerHistory.matchResults : { wins: 3, losses: 1 };

        return (
            <div className='summary-container'>
                <div className='column1'>

                    {/* Icon / rating */}
                    <div style={{ backgroundImage: `url(${this.props.summoner.summoner.profileIcon})` }} className='summonerImage' />

                    {/* Summoner Name / rank / Level */}
                    <p className='summoner-label'> {
                        this.props.summoner.summoner.summonerName}

                        {/* Favorite */}
                        {this.canFavorite() &&
                            <em className='favorite-player' onClick={this.handleFavoriteClick}> ★ </em>
                        }
                    </p>

                    <p className='summoner-rank'>
                        {this.props.summoner.summoner.rank}
                    </p>

                </div>
                <div className='column3'>
                    {/* Reviews */}
                    <SummonerReviewComponent />
                </div>

            </div>
        );
    }
}

const mapStoreToProps = store => ({
    summoner: store.summoner,
    user: store.user
})

export default connect(mapStoreToProps)(SummonerSummary);