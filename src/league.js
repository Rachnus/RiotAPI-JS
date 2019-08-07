const Api       = require('./api.js');

var QUEUE_TYPE =
{
    INVALID:              -1,
    SOLO_DUO:              0,
    FLEX:                  1,
   
    MAX_QUEUE_TYPE:        2
}

class MiniSeriesDTO
{
    constructor(progress = 0, target = 0, losses = 0, wins = 0)
    {
        this.m_szProgress = progress;
        this.m_iTarget = target;
        this.m_iLosses = losses;
        this.m_iWins = wins;
    } 
}

class SummonerLeague
{
    constructor(queue_type = null, 
                summoner_name = null,
                hot_streak = null,
                mini_series = null,
                wins = null,
                veteran = null,
                losses = null,
                rank = null,
                league_id = null,
                inactive = null,
                fresh_blood = null,
                tier = null,
                summoner_id = null,
                league_points = null)
    {
        this.m_szQueueType = queue_type;
        this.m_szSummonerName = summoner_name;
        this.m_bHotStreak = hot_streak;
        this.m_MiniSeries = mini_series;
        this.m_iWins = wins;
        this.m_bVeteran = veteran;
        this.m_iLosses = losses;
        this.m_szRank = rank;
        this.m_szLeagueID = league_id;
        this.m_bInactive = inactive;
        this.m_bFreshBlood = fresh_blood;
        this.m_szTier = tier;
        this.m_szSummonerID = summoner_id;
        this.m_iLeaguePoints = league_points;

        this.m_eQueueType = QUEUE_TYPE.INVALID;
    }

    setQueueType(queue_type)
    {
        this.m_eQueueType = queue_type;
    }

    /**
     * Parses summoner league JSON data
     *
     * @param json                 json data (string)
     * @return SummonerLeague[]
     */
    static parseLeagueJSON(json)
    {
        var leagues = [];
        for(var i = 0; i < json.length; i++)
        {
            var leagueObj = json[i];

            var miniSeries = null;
            var jsonMiniSeries = json[i].miniSeries;
            if(jsonMiniSeries != null)
            {
                miniSeries = new MiniSeriesDTO(jsonMiniSeries.progress, 
                                               jsonMiniSeries.target, 
                                               jsonMiniSeries.losses, 
                                               jsonMiniSeries.wins);
            }

            var league = new SummonerLeague(leagueObj.queueType,
                                            leagueObj.summonerName,
                                            leagueObj.hotStreak,
                                            miniSeries,
                                            leagueObj.wins,
                                            leagueObj.veteran,
                                            leagueObj.losses,
                                            leagueObj.rank,
                                            leagueObj.leagueId,
                                            leagueObj.inactive,
                                            leagueObj.freshBlood,
                                            leagueObj.tier,
                                            leagueObj.summonerId,
                                            leagueObj.leaguePoints);

            league.setQueueType(League.QueueTypeNameToId(league.m_szQueueType));
            leagues.push(league);
        }
        return leagues;
    }
}

function QueueTypeNameToId(queue_type)
{
    if(queue_type == 'RANKED_SOLO_5x5')
        return QUEUE_TYPE.SOLO_DUO;
    if(queue_type == 'RANKED_FLEX_SR')
        return QUEUE_TYPE.FLEX;
    return QUEUE_TYPE.INVALID;
}

module.exports =
{
    SummonerLeague,
    MiniSeriesDTO,
    QUEUE_TYPE,
    QueueTypeNameToId
};
