// *----------* React App *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Page Components *----------*
import ReviewDropDown from './ReviewDropDown/ReviewDropDown';
import SummonerReviewComponent from './SummonerReviewComponent/SummonerReviewComponent';

// *----------* Components *----------*
import { ResponsivePie } from '@nivo/pie';

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

    handleReviewPlayerClick = () => {
        // Send request to saga -> post review -> fetch reviews
        this.setState({
            showReviewForm: !this.state.showReviewForm
        })
    }

    canLeaveReview = () => {
        // Check if this user has reviewed the current summoner being displayed
        const didReview = (this.props.user.reviews.map(review => review.reviewed_summonerName)
            .indexOf(this.props.summoner.summoner.summonerName) > -1);

        console.log(`DID REVIEW = ${didReview}`);


        if (this.props.user.user.id && !didReview && (this.props.summoner.summoner.summonerName != this.props.user.user.summoner_Name)) {
            return true;
        } else {
            return false;
        }
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

                {/* <div className='column2'>

                    {this.canLeaveReview() &&
                        <div>
                            <p className='review-player' onClick={this.handleReviewPlayerClick}> Write a review </p>

                            <ReviewDropDown 
                                userId={this.props.user.user.id}
                                summonerName={this.props.summoner.summonerName}
                                showReviewForm={this.state.showReviewForm} 
                                toggleReviewForm = {this.handleReviewPlayerClick}/>
                        </div>
                    }


                </div> */}
            </div>
        );
    }
}

const mapStoreToProps = store => ({
    summoner: store.summoner,
    user: store.user
})

export default connect(mapStoreToProps)(SummonerSummary);