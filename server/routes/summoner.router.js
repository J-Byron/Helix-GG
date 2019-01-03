// *----------* Modules *----------*
const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// *----------* Routes *----------*

router.get('/:region/:summonerName', (req,res)=>{

    // Prepare data from request params
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const API_KEY = process.env.API_KEY;

    // Holds identifiers for further requests about summoner
    let summonerIDs = {
        summonerId: '',     // league rank endpoint
        accountId: '',      // match list endpoint
        puuid: '',          // migration to v4
        profileIconId: '',  // for fetching icon in ddragon
    };

    // Data to be sent to be used by client
    let summonerData = {
        level: '',  //  1-999
        rank: '',   // unranked-challenger
        icon: '',   // .png
        winrate: {normal:'',ranked:''}, // Winrate for past 20 games
        KDA: {normal:{kills:0, deaths: 0, assists: 0, kda:0}, ranked: {kills:0, deaths: 0, assists: 0, kda:0}},  
        top3ChampData: {normal: [],ranked:[]},  // KDA & WR for top 3 champs along with icon 
        championData: [],                       // Top 10 ranked champs [{champion icon, win rate, averages cs, kda }]
        matchHistory: {normal:[], ranked:[]},   // [{matchid, build, champion icon, cs, date, result, kda, [teammates]}]
    }

    /* 
        -Queue Types-

        400: Draft 
        420: Ranked
        450: ARAM
        440: Flex
        850: Intermediate Bots
        840: Beginner Bots   
        
        -Rate Limits-

        'x-app-rate-limit': '20:1,100:120',
        'x-method-rate-limit': '1000:10',

        -Request rates-

        Summoner name - 1
        Summoner Rank - 1
        Match History = (1 + 20) + (1 + 20) = 42

    */


    console.log(`${region} ${summonerName} ${API_KEY}`);

    // Query riotgames for summoner by summoner name 
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`).then(response =>{

        // update summonerIDs
        summonerIDs.summonerId = response.data.id;
        summonerIDs.accountId = response.data.accountId;
        summonerIDs.puuid = response.data.puuid;
        summonerIDs.profileIconId = response.data.profileIconId;

        // Query league rank by summonerID
        axios.get(`https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerIDs.summonerId}?api_key=${API_KEY}`)
        .then(response => {

            // Find ranked Details
            response.data.forEach(element => {
                if(element.queueType === 'RANKED_SOLO_5x5'){
                    summonerData.rank = `${element.tier} ${element.rank}`
                    // console.log(element.tier,element.rank ,element.leaguePoints)
                }
            });
        }).catch(error=>{
            console.log(error.response);
            res.sendStatus(400);
        })

        // Query ranked solo queue match history
        axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=420&endIndex=5&beginIndex=0&api_key=${API_KEY}`)
        .then(response =>{

            // Query data for each individual match of matchlist with gameID
            for (let match of response.data.matches){
                axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${API_KEY}`)
                .then(response =>{


                    const matchData = response.data;
                    let matchParticipantId;
                    let matchParticipantNames;

                    // find summoner participant id -> find build, find match result, find teammates

                    // find summoner participant id & match player names
                    for(let participant of matchData.participantIdentities){
                        if(summonerName.toUpperCase() ===  participant.player.summonerName.toUpperCase()){
                            
                            // get the matchParticipant id of the queried summoner in particular match
                            matchParticipantId = participant.participantId;

                            // Determine participants of match (excluding queried Summoner)
                            matchParticipantNames = matchData.participantIdentities.filter(participant => {
                                return participant.participantId != matchParticipantId
                            }).map(participant => participant.player.summonerName)
                            
                            break;
                        }
                    }

                    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`)
                }).catch(error => {
                    console.log(error.response);
                })
            }

        }).catch(error=>{
            console.log(error.response);
        })

        // Query normal queue match history
        // axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=400&endIndex=20&beginIndex=0&api_key=${API_KEY}`)
        // .then(response =>{

        //     // Query data for each individual match of matchlist with gameID
        //     for (let match of response.data.matches){

        //         axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${API_KEY}`)
        //         .then(response =>{

        //             console.log(response.data);
        //         })
        //     }

        // }).catch(error=>{
        //     console.log(error);
        // })

        // Query matchlist by accountID
            // Calculate winrate, KDA, and top3ChampionData
            // query each match and update each matchhistory with relevant data from each match

            console.log(
                `Rate limits: 
                    App-- limit: [${response.headers["x-app-rate-limit"]}] count: [${response.headers["x-app-rate-limit-count"]}]
                    Method-- limit: [${response.headers["x-method-rate-limit"]}] count: [${response.headers["x-method-rate-limit-count"]}]
                    `
                );

    }).catch(error=>{
        // res.send({didSucceed: false, data: null})\
        console.log(error.response);
        res.sendStatus(400);
    })

    

})

// *----------* Helper functions *----------*

module.exports = router;