// *----------* React App *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Page Components *----------*
import ReviewDropDown from './ReviewDropDown/ReviewDropDown';

// *----------* Styling *----------*
import './SummonerSummary.css'

class SummonerSummary extends Component {
    state = {
        showReviewForm: false,
        showFavorite: true,
    }

    componentDidMount() {
        // If user already favorited the displayed summoner, do not give ability to favorite
        const favorites = this.props.user.favorites;
        if ((favorites.indexOf(this.props.summoner.summonerName) > -1) && this.props.user.user.id) {
            this.setState({
                showFavorite: false
            })
        }else if(!this.props.user.user.id){
            this.setState({
                showFavorite: false
            })
        }

    }

    handleFavoriteClick = () => {
        // Send request to saga -> set favorites -> fetchFavorites
        this.props.dispatch({
            type: 'POST_FAVORITE_SUMMONER',
            payload: {
                userId: this.props.user.user.id,
                summonerName: this.props.summoner.summonerName
            }
        })

        this.setState({
            showFavorite: false
        })
    }

    handleReviewPlayerClick = () => {
        // Send request to saga -> post review -> fetch reviews
        this.setState({
            showReviewForm: !this.state.showReviewForm
        })
    }

    render() {
        // Check if favoritable
        // if((this.props.user.favorites.)){
        //     this.setState({
        //         showFavorite: false
        //     })
        // }

        return (
            <div className='summary-container'>
                <div className='column1'>

                    {/* Icon / rating */}
                    <div style={{ backgroundImage: `url(${this.props.summoner.profileIcon})` }} className='summonerImage' />

                    {/* Summoner Name / rank / Level */}
                    <p className='summoner-label'> {
                        this.props.summoner.summonerName}

                        {/* If logged in : Favorite */}
                        {this.state.showFavorite &&
                            <em className='favorite-player' onClick={this.handleFavoriteClick}> ★ </em>
                        }
                    </p>

                    <p className='summoner-rank'>
                        {this.props.summoner.rank}
                    </p>

                </div>
                <div className='column2'>
                    {/* <div className='rating'>
                        {'Rating: 5'}
                    </div> */}
                    {/* If logged in and summoner is in match history: Review player */}
                    {this.props.user.user.id &&
                        <div>
                            <p className='review-player' onClick={this.handleReviewPlayerClick}> Write a review </p>

                            <ReviewDropDown 
                                summonerName={this.props.summoner.summonerName}
                                showReviewForm={this.state.showReviewForm} 
                                toggleReviewForm = {this.handleReviewPlayerClick}/>
                        </div>
                    }
                </div>
                <div className='column3'>
                    {/* Reviews */}
                </div>
            </div>
        );
    }
}

const mapStoreToProps = store => ({
    summoner: store.summoner.summoner.data,
    user: store.user
})

export default connect(mapStoreToProps)(SummonerSummary);