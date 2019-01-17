// *----------* CRA *----------*
import React, {Component} from 'react';

// *----------* Redux *----------*
import {connect} from 'react-redux';

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
        showDetail : false,
        itemReview : '',
        itemRating: '',
        itemSummoner: '',
    }

    componentWillMount(){
        // On mount load state
        console.log('REVIEW: ',this.props.review);
        
        this.setState({
            itemReview: this.props.review.content,
            itemRating: this.props.review.rating,
            itemSummoner: this.props.review.reviewed_summonerName
        })
    }

    toggleShowDetail = () => {
        // Toggle ShowDetails
        this.setState({
            showDetail: !this.state.showDetail
        })
    }

    handleUpdateClick = () => {
        // dispatch update

    }

    reviewItemDetail = () =>{
        return;
    }

    reviewItemMaster = () => {
        return;
    }

    render(){
        let cell;

        if(this.state.showDetail){
            cell = (
                <div className='reviewCell-detail'>
                </div>
            );
        }else{
            console.log(this.state);
            
            cell = (
                <div className='reviewCell-master'>
                
                </div>
            );
        }

        return (
            <div>
                {cell}
            </div>
            )
    }
}

export default ProfileReviewsItem;