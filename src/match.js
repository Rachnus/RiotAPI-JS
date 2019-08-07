class SummonerMatch
{
    constructor(lane = null, 
                game_id = null,
                champion = null,
                platform_id = null,
                timestamp = null,
                queue = null,
                role = null,
                season = null)
    {
        this.m_szLane = lane;
        this.m_iGameID = game_id;
        this.m_iChampionID = champion;
        this.m_szPlatformID = platform_id;
        this.m_iTimeStamp = timestamp;
        this.m_iQueue = queue;
        this.m_szRole = role;
        this.m_iSeason = season;
    }
}

module.exports =
{
    SummonerMatch,
};
