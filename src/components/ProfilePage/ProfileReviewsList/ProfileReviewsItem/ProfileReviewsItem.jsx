// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './ProfileReviewsItem.css'

/*
    Displays
        Summoner Reviewed
        Review
        Rating

    OnClick
        Shows Review & Rating (editable)

*/

class ProfileReviewsItem extends Component {

    state = {
        detailIsVisible: false,
        itemReview: '',
        itemRating: '',
        itemId:'',
    }

    componentWillMount() {
        // On mount load state
        console.log('REVIEW: ', this.props.review);

        this.resetState()
    }

    resetState = () =>{
        this.setState({
            itemReview: this.props.review.content,
            itemRating: this.props.review.rating,
            itemId: this.props.review.id
        })
    }

    handleSaveClick = () => {
        // dispatch update
        console.log('Shipping ', this.state);

        this.props.dispatch({
            type: 'UPDATE_USER_REVIEW',
            payload: {
                reviewId: this.state.itemId,
                reviewRating: this.state.itemRating,
                reviewContent: this.state.itemReview,
                userId: this.props.userId
            }
        })

        // close edit window
        this.setState({
            detailIsVisible: false
        })
        
    }

    handleDeleteClick = () =>{
        console.log('Deleting', this.state.itemId);
        this.props.dispatch({
            type: 'DELETE_USER_REVIEW',
            payload: {userId: this.props.userId, reviewId: this.state.itemId}
        })
    }

    // Set CSS rule for an element depending on whether or not it is selected
    ratingRuleFor = (rating) => {
        return (this.state.itemRating == rating)? 'cell-rating cell-rating-Selected' : 'cell-rating'
    }

    handleRatingClick = (rating) => (event) => {
        
        this.setState({
            itemRating: rating
        })

        console.log('Rating set to', this.state.itemRating);
        
    }

    handleContentChange = (event) => {
        this.setState({
            itemReview: event.target.value
        })
    }


    render() {

        let cell = (
            <div className={`reviewCell ${this.state.detailIsVisible ? 'cell-open' : 'cell-closed'}`}
                style={{
                    backgroundColor: `${(this.state.itemRating < 3) ? ('#ff2f64') : ('rgb(12, 160, 170)')}`,
                    boxShadow: `${(this.state.itemRating < 3) ? ('0px 2px #7c1d35') : (' 0px 2px #006368')}`,
                    transition: 'all .2s'
                }}
            >
                <div className='cell-header'>
                    {/* Summoner who user reviewed */}
                    <div className='cell-summoner'>
                        {this.props.review.reviewed_summonerName}
                    </div>

                    {/* Close detail */}
                    <div
                        className='cell-close-detail'
                        // On Close click, close detail and reset state
                        onClick={() => {
                            this.setState({ detailIsVisible: !this.state.detailIsVisible });
                            this.resetState();
                            }}>
                        {this.state.detailIsVisible ? (
                            <span className='cell-detail-close'>
                                ✖
                            </span>
                        ) : (
                                <span className='cell-detail-edit'>
                                    . . .
                                </span>
                            )
                        }
                    </div>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                    <textarea
                        className={`cell-content cell-content-${this.state.detailIsVisible ? 'open' : 'closed'}`}
                        readOnly={!this.state.detailIsVisible}
                        rows="2"
                        maxLength={25}
                        value={this.state.itemReview}
                        onChange={this.handleContentChange}
                        spellCheck="false"
                    />

                    {/* Rating */}
                    {/* Read Only */}
                    {!this.state.detailIsVisible &&
                        <div className={`review-cell-rating${this.state.itemRating}`}>
                            {this.state.itemRating}
                        </div>
                    }

                    {/* Edit */}

                    {
                        this.state.detailIsVisible &&
                        <div className='cell-edit-right'>
                            <p className='cell-ratings'>
                                <em className={this.ratingRuleFor(1)} onClick={this.handleRatingClick(1)}>
                                    1
                                    </em>
                                <em className={this.ratingRuleFor(2)} onClick={this.handleRatingClick(2)}>
                                    2
                                    </em>
                                <em className={this.ratingRuleFor(3)} onClick={this.handleRatingClick(3)}>
                                    3
                                    </em>
                                <em className={this.ratingRuleFor(4)} onClick={this.handleRatingClick(4)}>
                                    4
                                    </em>
                                <em className={this.ratingRuleFor(5)} onClick={this.handleRatingClick(5)}>
                                    5
                                    </em>
                            </p>

                            <div className='cell-button-container'>
                                <div className='cell-save-button' onClick={this.handleSaveClick}>
                                    save
                                </div>
                                <div className='cell-delete-button' onClick={this.handleDeleteClick}>
                                    delete
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );

        return (
            <div>
                {cell}
            </div>
        )
    }
}

const mapStoreToProps = store => ({
    // Children need user's reviews & favorites
    userId: store.user.user.id
})

export default connect(mapStoreToProps)(ProfileReviewsItem);