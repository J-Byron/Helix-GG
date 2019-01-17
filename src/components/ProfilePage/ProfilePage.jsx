// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Redux *----------*
import { connect } from 'react-redux';

// *----------* Components *----------*
import ProfileReviewsList from './ProfileReviewsList/ProfileReviewsList'

// *----------* Styling *----------*
import './ProfilePage.css'



class ProfilePage extends Component {
    render() {
        console.log(this.props.reviews);
        console.log(this.props.favorites);

        return (
            <div>
                <div className='profile-header'>
                    Profile Page
                </div>
                <div style={{ display: 'flex' }}>
                    <div className='profile-list-container profile-reviews'>
                        <div className='profile-reviews-header'>
                            Reviews
                        </div>
                        <ProfileReviewsList reviews={this.props.reviews} />
                    </div>

                    <div className='profile-list-container profile-favorites'>
                        <div className='profile-reviews-header'>
                            Favorites
                        </div>
                        {/* <ProfileFavoritesComponent/> */}
                        

                    </div>
                </div>
            </div>
        );
    }
}

const mapStoreToProps = store => ({
    // Children need user's reviews & favorites
    reviews: store.user.reviews,
    favorites: store.user.favorites
})

export default connect(mapStoreToProps)(ProfilePage);

