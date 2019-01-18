// *----------* CRA *----------*
import React, { Component } from 'react';

// *----------* Components *----------*
import ProfileFavoriteItem from './ProfileFavoriteItem/ProfileFavoriteItem'

// *----------* Styling *----------*
import './ProfileFavoritesList.css'

const ProfileFavoritesList = (props) => {
    return(
        <div>
            {
                props.favorites.map((favorite,index)=>{
                    return(<ProfileFavoriteItem key={index} favorite={favorite}/>)
                })
            }
        </div>
    )
}

export default ProfileFavoritesList;