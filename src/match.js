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

    /**
     * Parses summoner match list JSON data
     *
     * @param json                 json data (string)
     * @return SummonerMatch[]
     */
    static parseMatchListJSON(json)
    {
        var matches = [];
        var jsonMatches = json.matches;

        for(var i = 0; i < jsonMatches.length; i++)
        {
            var matchObj = matches[i];

            var match = new SummonerMatch(matchObj.lane,
                                          matchObj.gameId,
                                          matchObj.champion,
                                          matchObj.platformId,
                                          matchObj.timestamp,
                                          matchObj.queue,
                                          matchObj.role,
                                          matchObj.season);
           
            matches.push(match);
        }
        return matches;
    }
}

module.exports =
{
    SummonerMatch,
};
