// *----------* React App *----------*
import React, { Component } from 'react'

// *----------* Redux *----------*
import { connect } from 'react-redux'

// *----------* Page components *----------*
import ReviewListItem from './ReviewListItem/ReviewListItem'

// *----------* Styling *----------*
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './SummonerReviewComponent.css'

class SummonerReviewComponent extends Component {
    render() {

        return (
            <div>
                <p className='recent-reviews'>
                    Recent Reviews
            </p>
                <div className='review-container'>
                    {(this.props.reviews.length == 0) ? (
                        <div className='review-container-empty'>
                            It's empty in here
                        </div>
                    ) : (
                            <div>
                                {this.props.reviews.map((review, index) => (

                                    <ReviewListItem review={review} />
                                ))
                                }
                            </div>
                        )}

                </div>
            </div>
        )
    }
}

const mapStoreToProps = store => ({
    reviews: store.summoner.reviews
})

export default connect(mapStoreToProps)(SummonerReviewComponent);