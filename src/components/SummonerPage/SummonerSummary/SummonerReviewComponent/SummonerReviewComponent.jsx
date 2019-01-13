// *----------* React App *----------*
import React, { Component } from 'react'

// *----------* Redux *----------*
import {connect} from 'react-redux'

// *----------* Page components *----------*
import ReviewListItem from './ReviewListItem/ReviewListItem'

// *----------* Styling *----------*
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import './SummonerReviewComponent.css'

class SummonerReviewComponent extends Component {
    render(){
        const reviewList = this.props.reviews.map((review,index) => {
            return(
                <TransitionGroup key={index}>
                    <CSSTransition
                        key={index}
                        timeout={1000}
                        classNames='fade-item'
                    >
                    <ReviewListItem review={review}/>
                    </CSSTransition>
                </TransitionGroup>
            );
        })

        return(
            <div className='review-container'>
                <ul className='review-list'>
                    {reviewList}
                </ul>
            </div>
        )
    }
}

const mapStoreToProps = store => ({
    reviews: store.summoner.reviews
})

export default connect(mapStoreToProps)(SummonerReviewComponent);