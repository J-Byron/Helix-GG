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
                    <TransitionGroup className='review-list'>
                        {
                            this.props.reviews.map((review, index) => (

                                <CSSTransition
                                    appear={true}
                                    // in={true}
                                    key={index}
                                    timeout={2000}
                                    classNames='itemfade'
                                    mountOnEnter
                                    unmountOnExit
                                    onEntered={()=>console.log('Entered')}
                                >
                                    <ReviewListItem review={review} />
                                </CSSTransition>

                            ))
                        }
                    </TransitionGroup>
            </div>
            </div>
        )
    }
}

const mapStoreToProps = store => ({
    reviews: store.summoner.reviews
})

export default connect(mapStoreToProps)(SummonerReviewComponent);