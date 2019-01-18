// *----------* Modules *----------*
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const axios = require('axios');
require('dotenv').config();

// *----------* Environment variables *----------*
const API_KEY = process.env.API_KEY; // riot games API key
const D_VERSION = process.env.DDRAGON_VERSION; // ddragon version

/* 

        -Notes-
            * Converting IDs to Names @ http://ddragonexplorer.com/cdn/8.24.1/data/en_US/
            * Images @ https://ddragonexplorer.com/cdn/
            * replace http://ddragonexplorer.com/ with https://ddragon.leagueoflegends.com/

        -Queue Types-

        500: Draft 
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

// *----------* Local Data (to be moved) *----------*

// objects to hold all champions/spells/tunes and their associated ids ( used for finding images )
let champions = {};
let spells = {};
let keystoneRunes = {};


// CHAMPIONS

// Query ddragon for all champions and map each with an id and name into champions
axios.get(`http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/data/en_US/champion.json`).then(response => {

    const championData = response.data.data;

    for (const champion in championData) {
        champions[`${championData[champion].key}`] = championData[champion].id;
    }

}).catch(err => {
    console.log(err);
});

// SPELLS
axios.get(`http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/data/en_US/summoner.json`).then(response => {
    const spellData = response.data.data;

    for (const spell in spellData) {
        spells[spellData[spell].key] = spellData[spell].image.full;
    }

}).catch(error => {
    console.log(error);
})

// RUNES

// http://ddragon.leagueoflegends.com/cdn/8.24.1/data/en_US/runesReforged.json by id grab icon path ->  
// http://ddragon.leagueoflegends.com/cdn/img/ + perk-images/Styles/7200_Domination.png

axios.get(`http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/data/en_US/runesReforged.json`).then(response => {
    const runeData = response.data;

    for (const keystone in runeData) {
        keystoneRunes[runeData[keystone].id] = runeData[keystone].icon;
        // spel[spellData[spell].key] = spellData[spell].image.full;
    }

}).catch(error => {
    console.log(error);
})

// *----------* Routes *----------*

    // *----------* Helix Database *----------*

router.get('/reviews/:summonerName',(req,res)=>{

    // Query arguments
    const summonerName = req.params.summonerName;

    // SQL query string
    const queryString = 
    `SELECT "reviewed_summonerName", "User"."summoner_Name" ,"rating", "content" 
    FROM "Review" JOIN "User" ON "User"."id" = "Review"."reviewing_user_id"
    where UPPER("reviewed_summonerName") = UPPER($1)
    ORDER BY "User"."id" DESC;`;

    //
    pool.query(queryString,[summonerName]).then(result=>{
        res.send(result.rows);
    }).catch(err=>{
        console.log(`Error in /api/summoner/:summonerName/reviews: `, err);
        res.sendStatus(500);
    })
})

    // *----------* Riot Games Database *----------*

// Endpoint for header Data
router.get('/:region/:summonerName', (req, res) => {

    // Prepare data from request params
    const region = req.params.region;
    const summonerName = req.params.summonerName;

    // Data to be sent to client and used to render header
    let data = {};

    // Query riotgames for summoner by summoner name 
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
    .then(response => {

        // update summonerIDs for use as params for riot endpoints
        let summonerId = response.data.id;
        let profileIconId = response.data.profileIconId;

        // Update summonerData with info from response
        data.summonerName = response.data.name;
        data.level = response.data.summonerLevel;
        data.profileIcon = `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/profileicon/${profileIconId}.png`;

        // Query league rank by summonerID
        axios.get(`https://na1.api.riotgames.com/lol/league/v4/positions/by-summoner/${summonerId}?api_key=${API_KEY}`)
            .then(response => {

                // Find ranked Details
                if (response.data.length == 0) {
                    data.rank = `Unranked`;
                } else {
                    response.data.forEach(element => {
                        if (element.queueType === 'RANKED_SOLO_5x5') {

                            // Update summonerData
                            data.rank = `${element.tier} ${element.rank}`
                            // console.log(element.tier,element.rank ,element.leaguePoints)
                        }
                    });
                }

                // Send Data back to client
                res.send(data);
            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })
    }).catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
})

// Endpoint for Body Data
router.get('/:region/:summonerName/:queue', (req, res) => {

    // Prepare data from request params
    const region = req.params.region;
    const summonerName = req.params.summonerName;
    const queueType = (req.params.queue == 'Ranked') ? 420 : 400;

    // Holds identifiers for further requests about summoner
    let summonerIDs = {
        summonerId: '',     // league rank endpoint
        accountId: '',      // match list endpoint
        puuid: '',          // migration to v4
    };

    // Data to be sent to be used by client
    let summonerData = {
        matchResults: { wins: 0, losses: 0, winrate: '' }, // Winrate for past 20 games Done
        KDA: { kills: 0, deaths: 0, assists: 0, kdar: '' }, // DONE
        top3ChampData: [],  // KDA & WR for top 3 champs along with icon DONE
        championData: [],   // Top 10 ranked champs [{champion icon, win rate, averages cs, kda }]
        matchHistory: [],   // [{matchid, build, champion icon, cs, date, result, kda, [teammates]}] DONE
    }

    console.log(`${region} ${summonerName} ${API_KEY}`);

    // Query riotgames for summoner by summoner name 
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`).then(response => {

        // update summonerIDs for use as params for riot endpoints
        summonerIDs.summonerId = response.data.id;
        summonerIDs.accountId = response.data.accountId;
        summonerIDs.puuid = response.data.puuid;

        // Query ranked solo queue match history
        axios.get(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${summonerIDs.accountId}?queue=${queueType}&endIndex=5&beginIndex=0&api_key=${API_KEY}`)
            .then(response => {

                // Keeps track of all champions played across queried matchlist
                let championHistory = {};

                /*
                    This is an immediate asynchronous arrow function

                    Its purpose it to:
                        * synchronously loop through an array of match requests
                        * Build A match object from the response of each match and push it into summonerData
                        * Calculate total match History statistics (wins/deaths/champions)
                        * After all requests are completed ( & summonerData is succesfully populated),
                          send summonerData back to client :) 

                    If this was not done in an asynchronous function, summonerData would be incomplete at delivery
                          
                */

                (async () => { 
                    // Sychonously Query data for each individual match of matchlist with gameID
                    for (let match of response.data.matches) {
                        await axios.get(`https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${API_KEY}`)
                            .then(response => {

                                // *----------* Convert response into matchInformation and populate summonerData *----------*

                                // Contains all relevant data about the match
                                const matchaResponseData = response.data;

                                // Queried summoner's identity in match
                                let queriedMatchParticipant;

                                // Information about each match, pushed into match history
                                let matchInformation = {};

                                // find summoner participant id 
                                for (let participant of matchaResponseData.participantIdentities) {

                                    if (summonerName.toUpperCase() === participant.player.summonerName.toUpperCase()) {
                                        // Need image for: 1 champion, 2 spells, 2 runes, 7 items, 10 players = 22 api requests

                                        // Get the matchParticipant id of the queried summoner in particular match
                                        queriedMatchParticipant = matchaResponseData.participants[participant.participantId - 1];
                                        break;
                                    }
                                }

                                // Champion *ddragonexplorer.com/cdn/8.24.1/img/champion/{}.png*
                                const summonerChampionId = queriedMatchParticipant.championId;
                                matchInformation.champion = { name: champions[summonerChampionId], icon: `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/champion/${champions[summonerChampionId]}.png` };

                                // If Champion already exists in champion history, 
                                // update that champions statistics 
                                // else create a new champion object

                                if (championHistory.hasOwnProperty(champions[summonerChampionId])) {
                                    const championStats = championHistory[champions[summonerChampionId]];

                                    championStats.wins += (queriedMatchParticipant.stats.win) ? 1 : 0;
                                    championStats.loses += (queriedMatchParticipant.stats.win) ? 0 : 1;
                                    championStats.totalGamesPlayed++ ,
                                        championStats.winrate = `${((championStats.wins / ((championStats.wins) + (championStats.loses))) * 100).toFixed(1)}%`;

                                    championStats.kills += queriedMatchParticipant.stats.kills;
                                    championStats.averageKills = Number((championStats.kills / championStats.totalGamesPlayed).toFixed(2));

                                    championStats.assists += queriedMatchParticipant.stats.assists;
                                    championStats.averageAssists = Number((championStats.assists / championStats.totalGamesPlayed).toFixed(2));

                                    championStats.deaths += queriedMatchParticipant.stats.deaths;
                                    championStats.averageDeaths = Number((championStats.deaths / championStats.totalGamesPlayed).toFixed(2));

                                    championStats.cs += (queriedMatchParticipant.stats.totalMinionsKilled + queriedMatchParticipant.stats.neutralMinionsKilled);
                                    championStats.averageCs = Number(((championStats.cs) / (championStats.totalGamesPlayed)).toFixed(2));

                                    championStats.kdar = `${Number(((championStats.kills + championStats.assists)/championStats.deaths).toFixed(1))}:1`;


                                } else {
                                    championHistory[champions[summonerChampionId]] = {
                                        champion: champions[summonerChampionId],
                                        icon: `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/champion/${champions[summonerChampionId]}.png`,
                                        wins: (queriedMatchParticipant.stats.win) ? 1 : 0,
                                        loses: (queriedMatchParticipant.stats.win) ? 0 : 1,
                                        totalGamesPlayed: 1,
                                        winrate: `${(queriedMatchParticipant.stats.win) ? '100' : '0'}%`,

                                        kills: queriedMatchParticipant.stats.kills,
                                        averageKills: queriedMatchParticipant.stats.kills,

                                        assists: queriedMatchParticipant.stats.assists,
                                        averageAssists: queriedMatchParticipant.stats.assists,

                                        deaths: queriedMatchParticipant.stats.deaths,
                                        averageDeaths: queriedMatchParticipant.stats.deaths,

                                        cs: (queriedMatchParticipant.stats.totalMinionsKilled + queriedMatchParticipant.stats.neutralMinionsKilled),
                                        averageCs: (queriedMatchParticipant.stats.totalMinionsKilled + queriedMatchParticipant.stats.neutralMinionsKilled),
                                    }
                                    
                                    const champStats = championHistory[champions[summonerChampionId]];

                                    champStats.kdar = `${Number(((champStats.kills + champStats.assists)/ champStats.deaths).toFixed(1))}:1`

                                }

                                // Spells *http://ddragonexplorer.com/cdn/8.24.1/data/en_US/summoner.json*
                                matchInformation.spells = {
                                    spell1Icon: `http://ddragon.leagueoflegends.com/cdn/8.24.1/img/spell/${spells[queriedMatchParticipant.spell1Id]}`,
                                    spell2Icon: `http://ddragon.leagueoflegends.com/cdn/8.24.1/img/spell/${spells[queriedMatchParticipant.spell2Id]}`
                                };

                                // End game items (to be refractored)
                                matchInformation.items = [
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item0}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item1}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item2}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item3}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item4}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item5}.png`,
                                    `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/item/${queriedMatchParticipant.stats.item6}.png`,
                                ]

                                // Runes *http://ddragonexplorer.com/cdn/img/perk-images/*
                                matchInformation.runes = {
                                    mainIcon: `http://ddragon.leagueoflegends.com/cdn/img/${keystoneRunes[queriedMatchParticipant.stats.perkPrimaryStyle]}`,
                                    subIcon: `http://ddragon.leagueoflegends.com/cdn/img/${keystoneRunes[queriedMatchParticipant.stats.perkSubStyle]}`
                                }

                                // CS
                                matchInformation.cs = queriedMatchParticipant.stats.totalMinionsKilled + queriedMatchParticipant.stats.neutralMinionsKilled;

                                // Date? (<1hr, hr, day, week) 

                                // Time (minutes:seconds)
                                matchInformation.time = `${Math.floor(matchaResponseData.gameDuration / 60)}m ${matchaResponseData.gameDuration % 60}s`;

                                // Result
                                matchInformation.result = queriedMatchParticipant.stats.win

                                // Update total results of matches
                                summonerData.matchResults[(queriedMatchParticipant.stats.win) ? 'wins' : 'losses'] += 1;

                                // KDA
                                matchInformation.kda = {
                                    kills: queriedMatchParticipant.stats.kills,
                                    deaths: queriedMatchParticipant.stats.deaths,
                                    assists: queriedMatchParticipant.stats.assists,
                                    kdar: `${
                                        ((queriedMatchParticipant.stats.kills + queriedMatchParticipant.stats.assists) / queriedMatchParticipant.stats.deaths).toFixed(2)
                                        }:1`
                                }

                                // Champion KDA

                                // Update total KDA of matches
                                summonerData.KDA.kills += queriedMatchParticipant.stats.kills;
                                summonerData.KDA.assists += queriedMatchParticipant.stats.assists;
                                summonerData.KDA.deaths += queriedMatchParticipant.stats.deaths;

                                // Players: Determine participants of match (excluding queried Summoner)
                                matchInformation.matchParticipants = matchaResponseData.participantIdentities.filter(participant => {
                                    return participant.participantId != queriedMatchParticipant.participantId
                                }).map(participant => {
                                    // An object with information about each player that isn't the queried summoner
                                    const player = matchaResponseData.participants[participant.participantId - 1];
                                    return {
                                        participantSummonerName: participant.player.summonerName,
                                        championIcon: `http://ddragon.leagueoflegends.com/cdn/${D_VERSION}/img/champion/${champions[player.championId]}.png`,
                                        teamId: player.teamId
                                    }
                                })

                                console.log(`\n Match [${match.gameId}] Succesfully Loaded \n`)

                                summonerData.matchHistory.push(matchInformation)

                            }).catch(error => {
                                console.log(error);
                                res.sendStatus(500);
                            })

                    }// End of matchlist for loop

                    // Show rate limits to prevent blacklist
                    console.log(
                        `Rate limits: 
                    App-- limit: [${response.headers["x-app-rate-limit"]}] count: [${response.headers["x-app-rate-limit-count"]}]
                    Method-- limit: [${response.headers["x-method-rate-limit"]}] count: [${response.headers["x-method-rate-limit-count"]}]
                    `
                    );

                    // *----------* Finalize summonerData Object for delivery to client *----------*

                    // Calculate Winrate after all match results calculated
                    summonerData.matchResults.winrate = `${
                        ((summonerData.matchResults.wins /
                            (summonerData.matchResults.wins + summonerData.matchResults.losses)) * 100).toFixed(1)
                        }%`

                    // Calculate kill/death ration after all matches' KDAs calculated
                    summonerData.KDA.kdar = `${((summonerData.KDA.kills + summonerData.KDA.assists) / summonerData.KDA.deaths).toFixed(2)}:1`;
                    summonerData.KDA.kills = Number((summonerData.KDA.kills / (summonerData.matchResults.wins + summonerData.matchResults.losses)).toFixed(1));
                    summonerData.KDA.deaths = Number((summonerData.KDA.deaths / (summonerData.matchResults.wins + summonerData.matchResults.losses)).toFixed(1));
                    summonerData.KDA.assists = Number((summonerData.KDA.assists / (summonerData.matchResults.wins + summonerData.matchResults.losses)).toFixed(1));
                    /* 
                        Calculate 3 most played champions by games played, after all matches 
                        .sort mutates original object

                        {keys} -> [keys], 
                        sort [keys] by {key}.total games played, 
                        push first 3 champs into summonerData.top3ChampData 
                    */

                    Object.keys(championHistory).sort((a, b) => {
                        return championHistory[b].totalGamesPlayed - championHistory[a].totalGamesPlayed
                    }).forEach((champion, i) => {
                        if (i <= 2) {
                            summonerData.top3ChampData.push(championHistory[champion])
                        }
                    })

                    res.send(summonerData);

                })() // End of immediate async function

            }).catch(error => {
                console.log(error);
                res.sendStatus(500);
            })

    }).catch(error => {
        // res.send({didSucceed: false, data: null})\
        console.log(error);
        res.sendStatus(500);
    })
})


module.exports = router;