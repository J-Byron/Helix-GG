// *----------* CRA *----------*
import React from 'react';

// *----------* Page components *----------*
import TopChampionItem from './TopChampionItem';

// *----------* Styling *----------*
import './TopChampionList.css'

const TopChampionList = (props) => {
    return(
        <div className='top-champions'>
            {props.champions.map((champion,i) =>(
                <TopChampionItem key={i} champion={champion}/>
            ))}
        </div>
    );
}

export default TopChampionList;