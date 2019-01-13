// *----------* Create App *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';
// *----------* Styling *----------*
import { CSSTransition } from 'react-transition-group';
import './ReviewDropDown.css'

class ReviewDropDown extends Component {
    state = {
        rating: 3,
        reviewContent: ''
    }

    handleSubmitDidClick = () => {
        // this.props.dispatch({
        //     type: 'POST_SUBMISSION',
        //     payload: {
        //         rating: this.state.reviewMessage,
        //         content: this.state.reviewContent
        //     }
        // })

        // Trigger unmount animation
        // this.props.toggleReviewForm();
        console.log('Shipping ', this.state);

        this.props.dispatch({
            type:'POST_REVIEW',
            payload: {
                summonerName: this.props.summonerName,
                rating: this.state.rating,
                reviewContent: this.state.reviewContent
            }
        })

    }

    handleRatingClick = (rating) => {
        
        this.setState({
            rating: rating
        })

        console.log('Rating set to', this.state.rating);
        
    }

    handleInputChange = (event) =>{
        this.setState({
            reviewContent: event.target.value
        })
    }

    ratingRuleFor = (rating) => {
        return (this.state.rating == rating)? 'ratingSelected' : 'rating'
    }



    render() {

        return (
            <CSSTransition
                in={this.props.showReviewForm}
                appear={true}
                timeout={500}
                classNames="review"
                mountOnEnter
                unmountOnExit
            // onExiting={()=>console.log(` Login Exiting!`)}
            // onEntering={()=>console.log(` Login Entering!`)}
            // onExiting={() => console.log("Leaving")}
            >
                <div>
                    <div className='review-container'>
                        {/* Ratings */}
                        <p className='ratings'>
                            <em className={this.ratingRuleFor(1)} onClick={()=>this.handleRatingClick(1)}>
                                1
                            </em>
                            <em className={this.ratingRuleFor(2)}  onClick={()=>this.handleRatingClick(2)}>
                                2
                            </em>
                            <em className={this.ratingRuleFor(3)}  onClick={()=>this.handleRatingClick(3)}>
                                3
                            </em>
                            <em className={this.ratingRuleFor(4)}  onClick={()=>this.handleRatingClick(4)}>
                                4
                            </em>
                            <em className={this.ratingRuleFor(5)}  onClick={()=>this.handleRatingClick(5)}>
                                5
                            </em>
                        </p>

                        {/* Message */}
                        <textarea value={this.state.reviewContent} className='review-message' type="text" placeholder='ex. Good Map Awareness' onChange={this.handleInputChange}/>
                        {/* Submit */}
                    </div >
                    <div className='review-submit-button' onClick={this.handleSubmitDidClick}>
                        Submit
                </div>
                </div>
            </CSSTransition>
        );
    }
}

export default connect()(ReviewDropDown);