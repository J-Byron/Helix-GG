// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Styling *----------*
import './ProfileFavoriteItem.css'

class ProfileFavoriteItem extends Component{
    render(){
        return(
            <div className='favorite-cell'>
                {/* {this.props.favorite} */}
                <div className='favorite-icon' style={{backgroundImage: `url(${this.props.favorite.summoner_profile_icon})`}} />

                <div className='favorite-summoner'>
                    {this.props.favorite.summoner_Name}
                </div>

                <div className='favorite-remove'>
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