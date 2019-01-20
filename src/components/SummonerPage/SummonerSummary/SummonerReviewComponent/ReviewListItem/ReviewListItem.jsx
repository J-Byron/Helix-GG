// *----------* React app *----------*
import React, { Component } from 'react';

// *----------* Styling *----------*
import './ReviewListItem.css';

class ReviewListItem extends Component {

    hasContent = () => {
        if (this.props.review.content === '') {
            return false;
        }
        return true;
    }

    hasReviewerIdentity = () => {
        if (this.props.review.summoner_Name) {
            return true;
        }

        return false;
    }

    render() {
        // review = this.props.review
        return (
            <div>
                {
                    this.hasContent() ? (
                        (<div 
                        className='review-cell'
                        style={{
                            backgroundColor: `${this.props.review.rating < 3 && '#ff2f64'}`,
                            borderColor: `${this.props.review.rating < 3 && '#ff2f64'}`,
                            boxShadow: `${this.props.review.rating < 3 && '0px 2px #7c1d35'}`
                        }} 
                        
                        >
                            {/* Reviewer */}

                            <p className='reviewer-text'>
                                {this.hasReviewerIdentity() ? `${this.props.review.summoner_Name}:` : 'Anonymous:'}
                            </p>

                            {/* Rating /  Content */}

                            <div className='review-content'>
                                {this.props.review.content}
                            </div>

                            <div className={`cell-rating${this.props.review.rating}`}>
                                {this.props.review.rating}
                            </div>
                        </div>)
                    ) : (
                            (<div className='review-cell-rating'>
                                {/* Reviewer */}

                                <p className='reviewer-text'>
                                    {this.hasReviewerIdentity() ? `${this.props.review.summoner_Name}:` : 'Anonymous:'}
                                </p>

                                {/* Rating /  Content */}
                                <div className={`cell-rating${this.props.review.rating}`}>
                                    {this.props.review.rating}
                                </div>
                            </div>)
                        )
                }
            </div>
        )
    }
}

export default ReviewListItem;