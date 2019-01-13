// *----------* React app *----------*
import React, {Component} from 'react';

// *----------* Styling *----------*
import './ReviewListItem.css';

class ReviewListItem extends Component {

    hasContent = () =>{
        if(this.props.review.content === ''){
            return false;
        }
        return true;
    }

    hasReviewerIdentity = () => {
        if(this.props.review.summoner_Name) {
            return true;
        }

        return false;
    }

    render(){
        // review = this.props.review
        return(
            <div className='review-cell'>
                {this.props.review.content}
            </div>
        )
    }
}

export default ReviewListItem;