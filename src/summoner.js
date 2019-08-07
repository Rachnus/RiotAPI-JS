const Api       = require('./api.js');
const Mastery   = require('./mastery.js');
const League    = require('./league.js');
const Match     = require('./match.js');

var SUMMONER_API_DATA =
{
    NONE:                            0,
    SUMMONER:                        1,
    CHAMPION_MASTERY:                2,
    TOTAL_MASTERY:                   4,
    LEAGUE:                          8,
    ACTIVE_GAME:                     16,

    MAX_NON_PARAM_SUMMONER_API_DATA: 16,

    MATCH_LIST:                      32,
}

/**
 * Summoner Class
 *
 */
class Summoner
{
    /**
     * Constructor
     * 
     * Optional:
     * Calls Summoner.getDataByName if summoner_name and api_callback parms are set
     *
     * @param summoner_name        name of the summoner (string) (json field: name) (optional)
     * @param data_flags           bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     * @param api_callback         function to call when request is complete (optional)
     *
     */
    constructor(summoner_name = null, data_flags = 0, api_callback = null)
    {
        this.m_nRequestStatus     = SUMMONER_API_DATA.NONE;

        this.m_eCurrentDataFlags  = 0;
        this.m_eTargetDataFlags   = 0;

        // Summoner
        this.m_iProfileIconID     = -1;
        this.m_szName             = null;
        this.m_szPUUID            = null;
        this.m_iSummonerLevel     = -1;
        this.m_iRevisionDate      = -1;
        this.m_szSummonerID       = -1; // id
        this.m_szAccountID        = -1;

        // Champion Mastery
        this.m_iTotalMasteryScore = -1;
        this.m_ChampionMasteries  = [];

        // Leagues
        this.m_Leagues = [];

        // Matches
        this.m_Matches = [];

        if(summoner_name != null)
            this.getDataByName(summoner_name, data_flags, api_callback);
    }

    /**
     * Gets summoner data from Riot API by summoner name
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getBySummonerName
     * 
     * @param summoner_name       name of the summoner (string) (json field: name)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getDataByName(summoner_name, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;
        
        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-name/${summoner_name}`), 
        function(error, response, body)
        {
            Summoner._api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted account id
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getByAccountId
     * 
     * @param encrypted_id        encrypted account id (string) (json field: accountId)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getDataByAccountID(encrypted_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;

        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-account/${encrypted_id}`), 
        function(error, response, body)
        {
            Summoner._api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted PUUID (Player Universally Unique IDentifier)
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getByPUUID
     * 
     * @param puu_id              encrypted PUUID (string) (json field: puuid)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getDataByPUUID(puu_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;

        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-puuid/${puu_id}`), 
        function(error, response, body)
        {
            Summoner._api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getBySummonerId
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getDataBySummonerID(summoner_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;

        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/${summoner_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Gets total mastery score from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#champion-mastery-v4/GET_getChampionMasteryScore
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getTotalMasteryScore(summoner_id, api_callback = null)
    {
        this.m_nRequestStatus |= SUMMONER_API_DATA.TOTAL_MASTERY;

        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/scores/by-summoner/${summoner_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.TOTAL_MASTERY);
        });
    }

    /**
     * Gets all summoner champion masteries from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#champion-mastery-v4/GET_getAllChampionMasteries
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    getChampionMasteries(summoner_id, api_callback = null)
    {
        this.m_nRequestStatus |= SUMMONER_API_DATA.CHAMPION_MASTERY;

        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.CHAMPION_MASTERY);
        });
    }

    /**
     * Gets summoner league data from Riot API by summoner id
     *
     * https://developer.riotgames.com/api-methods/#league-v4/GET_getLeagueEntriesForSummoner
     * 
     * @param summoner_id          summoner id (string) (json field: id)
     * @param api_callback         function to call when request is complete (optional)
     * @return void
     */
    getLeagueData(summoner_id, api_callback = null)
    {
        this.m_nRequestStatus |= SUMMONER_API_DATA.LEAGUE;

        var self = this;
        Api.Request(Api.BuildURL(`lol/league/v4/entries/by-summoner/${summoner_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.LEAGUE);
        });
    }

    /**
     * Gets summoner match data from Riot API by summoner id
     *
     * https://developer.riotgames.com/api-methods/#match-v4/GET_getMatchlist
     * 
     * @param account_id           account id (string) (json field: accountId)
     * @param api_callback         function to call when request is complete (optional)
     * @param champion_id          champion id to look for (optional)
     * @param queue_id             queue id (optional)
     * @param season_id            season id (optional)
     * @param endTime              end time unix timestamp in milliseconds (optional)
     * @param beginTime            start time unix timestamp in milliseconds(optional)
     * @param endIndex             amount of matches to search for, combined with begin index (optional)
     * @param beginIndex           amount of matches to search for, combined with end index (optional)
     * @return void
     */
    getMatchData(account_id, api_callback = null, champion_id = null, queue_id = null, season_id = null, endTime = null, beginTime = null, endIndex = null, beginIndex = null)
    {
        this.m_nRequestStatus |= SUMMONER_API_DATA.MATCH_LIST;

        var params = '';

        if(champion_id != null)
            params += `&champion=${champion_id}`
        if(queue_id != null)
            params += `&queue=${queue_id}`
        if(season_id != null)
            params += `&season=${season_id}`
        if(endTime != null)
            params += `&endTime=${endTime}`
        if(beginTime != null)
            params += `&beginTime=${beginTime}`
        if(endIndex != null)
            params += `&endIndex=${endIndex}`
        if(beginIndex != null)
            params += `&beginIndex=${beginIndex}`

        var self = this;
        Api.Request(Api.BuildURLParams(`/lol/match/v4/matchlists/by-account/${account_id}`, params), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.MATCH_LIST);
        });
    }

    /**
     * Make sure to use summoner.<member> instead of this.<member> in this function
     */
    static _summoner_api_callback(error, response, body, api_callback, summoner, type)
    {
        // Do not add API calls that require custom input like match list
        if(type <= SUMMONER_API_DATA.MAX_NON_PARAM_SUMMONER_API_DATA)
            summoner.m_eCurrentDataFlags |= type;

        if(summoner.m_nRequestStatus & type)
            summoner.m_nRequestStatus ^= type;

        var validCall = Api.IsValidApiCall(response.statusCode);
        
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var json = {};
        if(validCall)
        {
            json = JSON.parse(body);
            
            switch(type)
            {
                case SUMMONER_API_DATA.SUMMONER:
                    summoner.parseSummonerJSON(json);
                    break;
                case SUMMONER_API_DATA.CHAMPION_MASTERY:
                    summoner.parseChampionMasteryJSON(json);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.parseTotalMasteryJSON(json);
                    break;
                case SUMMONER_API_DATA.LEAGUE:
                    summoner.parseLeagueJSON(json);
                    break;
                case SUMMONER_API_DATA.ACTIVE_GAME:

                    break;
                case SUMMONER_API_DATA.MATCH_LIST:
                    summoner.parseMatchListJSON(json);
                    break;
            }
        }

        // If we're done with all API calls
        if(summoner.m_eCurrentDataFlags == summoner.m_eTargetDataFlags || type > SUMMONER_API_DATA.MAX_NON_PARAM_SUMMONER_API_DATA)
        {
            // If no callback was passed, just return
            if(api_callback == null)
                return;

            api_callback(summoner, type, validCall);
        }
        else
        {
            // If we still have API calls to complete

            // While bit is a bit flag set in target flags AND
            // bit is not a flag thats set in currnet flags AND
            // bit is less than max bit flags in SUMMONER_API_DATA enum

            var bit = 1;
            for(; bit < SUMMONER_API_DATA.MAX_NON_PARAM_SUMMONER_API_DATA; bit *= 2)
            {
                if(bit & summoner.m_eTargetDataFlags && !(bit & summoner.m_eCurrentDataFlags))
                    break;
            }
            
            switch(bit)
            {
                case SUMMONER_API_DATA.CHAMPION_MASTERY:
                    summoner.getChampionMasteries(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.getTotalMasteryScore(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.LEAGUE:
                    summoner.getLeagueData(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.ACTIVE_GAME:

                    break;
            }
        } 
    }

    /**
     * Parses summoner JSON data
     *
     * @param json                 json data (string)
     * @return void
     */
    parseSummonerJSON(json)
    {
        this.m_iProfileIconID = json.profileIconId;
        this.m_szName         = json.name;
        this.m_szPUUID        = json.puuid;
        this.m_iSummonerLevel = json.summonerLevel;
        this.m_iRevisionDate  = json.revisionDate;
        this.m_szSummonerID   = json.id;
        this.m_szAccountID    = json.accountId;
    }

    /**
     * Parses total mastery score JSON data
     *
     * @param json                 json data (string)
     * @return void
     */
    parseTotalMasteryJSON(json)
    {
        this.m_iTotalMasteryScore = json;
    }

    /**
     * Parses champion mastery JSON data (List)
     *
     * @param json                 json data (string)
     * @return void
     */
    parseChampionMasteryJSON(json)
    {
        for(var i = 0; i < json.length; i++)
        {
            var mastery = new Mastery.Mastery();
            mastery.parseMasteryJSON(json[i]);
            this.m_ChampionMasteries.push(mastery);
        }
    }

    /**
     * Parses summoner league JSON data
     *
     * @param json                 json data (string)
     * @return void
     */
    parseLeagueJSON(json)
    {
        this.m_Leagues = [];
        for(var i = 0; i < json.length; i++)
        {
            var leagueObj = json[i];

            var miniSeries = null;
            var jsonMiniSeries = json[i].miniSeries;
            if(jsonMiniSeries != null)
            {
                miniSeries = new League.MiniSeriesDTO(jsonMiniSeries.progress, 
                                                      jsonMiniSeries.target, 
                                                      jsonMiniSeries.losses, 
                                                      jsonMiniSeries.wins);
            }

            var league = new League.SummonerLeague(leagueObj.queueType,
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
            this.m_Leagues.push(league);
        }
    }

    /**
     * Parses summoner match list JSON data
     *
     * @param json                 json data (string)
     * @return void
     */
    parseMatchListJSON(json)
    {
        this.m_Matches = [];
        var matches = json.matches;

        for(var i = 0; i < matches.length; i++)
        {
            var matchObj = matches[i];

            var match = new Match.SummonerMatch(matchObj.lane,
                                                matchObj.gameId,
                                                matchObj.champion,
                                                matchObj.platformId,
                                                matchObj.timestamp,
                                                matchObj.queue,
                                                matchObj.role,
                                                matchObj.season);
           
            this.m_Matches.push(match);
        }
    }

    getSummonerLeague(queue_type)
    {
        for(var i = 0; i < this.m_Leagues.length; i++)
        {
            if(this.m_Leagues[i].m_eQueueType == queue_type)
                return this.m_Leagues[i];
        }
        return null;
    }
}

module.exports =
{
    Summoner,
    
    SUMMONER_API_DATA
};
