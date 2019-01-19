// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Components *----------*
import ProfileReviewsItem from './ProfileReviewsItem/ProfileReviewsItem'

// *----------* Styling *----------*
import './ProfileReviewsList.css'

const ProfileReviewsList = (props) => {
    return(
        <div>
            {
                props.reviews.map((review,index)=>{
                    return(<ProfileReviewsItem key={index} review={review}/>)
                })
            }
        </div>
    )
}

export default ProfileReviewsList;