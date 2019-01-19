// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './ProfileFavoriteItem.css'

class ProfileFavoriteItem extends Component{

    handleDeleteClick = () =>{
        // Dispatch Delete action
        this.props.dispatch({
            type:'DELETE_FAVORITE',
            payload: {
                id: this.props.favorite.id,
                userId: this.props.favorite.user_id
            }
        })
    }

    render(){
        return(
            <div className='favorite-cell'>
                {/* {this.props.favorite} */}
                <div className='favorite-icon' style={{backgroundImage: `url(${this.props.favorite.summoner_profile_icon})`}} />

                <div className='favorite-summoner'>
                    {this.props.favorite.summoner_Name}
                </div>

                <div className='favorite-remove' onClick={this.handleDeleteClick}>
                    Remove
                </div>
            </div>
        );
    }
}

// Can be passed down from profile page props
const mapStoreToProps = store => ({
    // Children need user's reviews & favorites
    userId: store.user.user.id
})

export default connect(mapStoreToProps)(ProfileFavoriteItem);