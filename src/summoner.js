const Api       = require('./api.js');
const Mastery   = require('./mastery.js');
const League    = require('./league.js');
const Match     = require('./match.js');
const Game      = require('./game.js');

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
        this.m_Leagues            = [];

        // Matches
        this.m_Matches            = [];

        // Active Game
        this.m_ActiveGame         = null;

        if(summoner_name != null && api_callback != null)
            this.queryDataByName(summoner_name, data_flags, api_callback);
    }

    /**
     * Query summoner data from Riot API by summoner name
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getBySummonerName
     * 
     * @param summoner_name       name of the summoner (string) (json field: name)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryDataByName(summoner_name, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;
        
        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-name/${summoner_name}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Query summoner data from Riot API by encrypted account id
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getByAccountId
     * 
     * @param encrypted_id        encrypted account id (string) (json field: accountId)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryDataByAccountID(encrypted_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;

        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-account/${encrypted_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Query summoner data from Riot API by encrypted PUUID (Player Universally Unique IDentifier)
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getByPUUID
     * 
     * @param puu_id              encrypted PUUID (string) (json field: puuid)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryDataByPUUID(puu_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
    {
        this.m_eTargetDataFlags   = data_flags;
        this.m_nRequestStatus    |= SUMMONER_API_DATA.SUMMONER;

        if(!(data_flags & SUMMONER_API_DATA.SUMMONER))
            return;

        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-puuid/${puu_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.SUMMONER);
        });
    }

    /**
     * Query summoner data from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#summoner-v4/GET_getBySummonerId
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param data_flags          bitflag field for what types of data to get from riot API (optional) (check SUMMONER_API_DATA enum at the top of this page)
     *                            SUMMONER_API_DATA.SUMMONER is required for other fields to work
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryDataBySummonerID(summoner_id, data_flags = SUMMONER_API_DATA.SUMMONER, api_callback = null)
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
     * Query total mastery score from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#champion-mastery-v4/GET_getChampionMasteryScore
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryTotalMasteryScore(summoner_id, api_callback = null)
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
     * Query all summoner champion masteries from Riot API by encrypted summoner id
     *
     * https://developer.riotgames.com/api-methods/#champion-mastery-v4/GET_getAllChampionMasteries
     * 
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete (optional)
     * @return void
     */
    queryChampionMasteries(summoner_id, api_callback = null)
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
     * Query summoner league data from Riot API by summoner id
     *
     * https://developer.riotgames.com/api-methods/#league-v4/GET_getLeagueEntriesForSummoner
     * 
     * @param summoner_id          summoner id (string) (json field: id)
     * @param api_callback         function to call when request is complete (optional)
     * @return void
     */
    queryLeagueData(summoner_id, api_callback = null)
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
     * Query summoner match data from Riot API by account id
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
    queryMatchData(account_id, api_callback = null, champion_id = null, queue_id = null, season_id = null, endTime = null, beginTime = null, endIndex = null, beginIndex = null)
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
        Api.Request(Api.BuildURLParams(`lol/match/v4/matchlists/by-account/${account_id}`, params), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.MATCH_LIST);
        });
    }

    /**
     * Query summoner active game data from Riot API by summoner id
     *
     * https://developer.riotgames.com/api-methods/#spectator-v4/GET_getCurrentGameInfoBySummoner
     * 
     * @param summoner_id           account id (string) (json field: accountId)
     * @param api_callback         function to call when request is complete (optional)
     * @return void
     */
    queryActiveGameData(summoner_id, api_callback = null)
    {
        this.m_nRequestStatus |= SUMMONER_API_DATA.ACTIVE_GAME;

        var self = this;
        Api.Request(Api.BuildURL(`lol/spectator/v4/active-games/by-summoner/${summoner_id}`), 
        function(error, response, body)
        {
            Summoner._summoner_api_callback(error, response, body, api_callback, self, SUMMONER_API_DATA.ACTIVE_GAME);
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
                    var newSum = Summoner.parseSummonerJSON(json);

                    summoner.m_iProfileIconID = newSum.m_iProfileIconID;
                    summoner.m_szName         = newSum.m_szName;
                    summoner.m_szPUUID        = newSum.m_szPUUID;
                    summoner.m_iSummonerLevel = newSum.m_iSummonerLevel;
                    summoner.m_iRevisionDate  = newSum.m_iRevisionDate;
                    summoner.m_szSummonerID   = newSum.m_szSummonerID;
                    summoner.m_szAccountID    = newSum.m_szAccountID;
                    break;
                case SUMMONER_API_DATA.CHAMPION_MASTERY:
                    summoner.m_ChampionMasteries = Mastery.Mastery.parseChampionMasteriesJSON(json);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.m_iTotalMasteryScore = Mastery.Mastery.parseTotalMasteryJSON(json);
                    break;
                case SUMMONER_API_DATA.LEAGUE:
                    summoner.m_Leagues = SummonerLeague.parseLeagueJSON(json);
                    break;
                case SUMMONER_API_DATA.ACTIVE_GAME:
                    summoner.m_ActiveGame = Game.ActiveGame.parseActiveGameJSON(json);
                    break;
                case SUMMONER_API_DATA.MATCH_LIST:
                    summoner.m_Matches = SummonerMatch.parseMatchListJSON(json);
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
            // bit is not a flag thats set in current flags AND
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
                    summoner.queryChampionMasteries(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.queryTotalMasteryScore(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.LEAGUE:
                    summoner.queryLeagueData(summoner.m_szSummonerID, api_callback);
                    break;
                case SUMMONER_API_DATA.ACTIVE_GAME:
                    summoner.queryActiveGameData(summoner.m_szSummonerID, api_callback);
                    break;
            }
        } 
    }

    /**
     * Parses summoner JSON data
     *
     * @param json                 json data (string)
     * @return Summoner
     */
    static parseSummonerJSON(json)
    {
        var summoner = new Summoner();
        summoner.m_iProfileIconID = json.profileIconId;
        summoner.m_szName         = json.name;
        summoner.m_szPUUID        = json.puuid;
        summoner.m_iSummonerLevel = json.summonerLevel;
        summoner.m_iRevisionDate  = json.revisionDate;
        summoner.m_szSummonerID   = json.id;
        summoner.m_szAccountID    = json.accountId;
        return summoner;
    }

    /**
     * Get current request status bitflag (Check SUMMONER_API_DATA)
     * 
     * This returns 0 if theres nothing being requested, if its not 0, something is currently being requested from Riot API
     * 
     * @return int
     */
    getRequestStatus()
    {
        return this.m_nRequestStatus;
    }

    /**
     * Get profile icon ID
     * 
     * @return int
     */
    getProfileIconID()
    {
        return this.m_iProfileIconID;
    }

    /**
     * Get summoner name
     * 
     * @return string
     */
    getName()
    {
        return this.m_szName;
    }

    /**
     * Get PUUID (Player Universally Unique ID)
     * 
     * @return string
     */
    getPUUID()
    {
        return this.m_szPUUID;
    }

    /**
     * Get summoner level
     * 
     * @return int
     */
    getLevel()
    {
        return this.m_iSummonerLevel;
    }

    /**
     * Get revision date
     * 
     * @return int
     */
    getRevisionDate()
    {
        return this.m_iRevisionDate;
    }

    /**
     * Get summoner id
     * 
     * @return string
     */
    getSummonerID()
    {
        return this.m_szSummonerID;
    }

    /**
     * Get account id
     * 
     * @return string
     */
    getAccountID()
    {
        return this.m_szAccountID;
    }

    /**
     * Get summoner league (Ranked Solo / Ranked Flex) object
     * 
     * @param queue_type         queue type (QUEUE_TYPE)
     * @return SummonerLeague
     */
    getSummonerLeague(queue_type)
    {
        for(var i = 0; i < this.m_Leagues.length; i++)
        {
            if(this.m_Leagues[i].m_eQueueType == queue_type)
                return this.m_Leagues[i];
        }
        return null;
    }

    /**
     * Get champion mastery list
     * 
     * @return Mastery[]
     */
    getChampionMasteries()
    {
        return this.m_ChampionMasteries;
    }

    /**
     * Get champion mastery by champion id
     * 
     * @return Mastery
     */
    getChampionMastery(champion_id)
    {
        return this.m_ChampionMasteries.get(champion_id);
    }

    /**
     * Get active game
     * 
     * @return ActiveGame
     */
    getActiveGame()
    {
        return this.m_ActiveGame;
    }

    /**
     * Get match list
     * 
     * @return SummonerMatch[]
     */
    getMatchList()
    {
        return this.m_Matches;
    }

    /**
     * Get total mastery score
     * 
     * @return int
     */
    getTotalMasteryScore()
    {
        return this.m_iTotalMasteryScore;
    }
}

/**
 * SummonerMatch Class
 */
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

            var match = new Match(matchObj.lane,
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

    /**
     * Get what lane the player played
     * 
     * @return string
     */
    getLane()
    {
        return this.m_szLane;
    }

    /**
     * Get current game id
     * 
     * @return int
     */
    getGameID()
    {
        return this.m_iGameID;
    }

    /**
     * Get champion id
     * 
     * @return int
     */
    getChampionID()
    {
        return this.m_iChampionID;
    }

    /**
     * Get platform id
     * 
     * @return string
     */
    getPlatformID()
    {
        return this.m_szPlatformID;
    }

    /**
     * Get timestmap
     * 
     * @return int
     */
    getTimeStamp()
    {
        return this.m_iTimeStamp;
    }

    /**
     * Get queue
     * 
     * @return int
     */
    getQueue()
    {
        return this.m_iQueue;
    }

    /**
     * Get role
     * 
     * @return string
     */
    getRole()
    {
        return this.m_szRole;
    }

    /**
     * Get season
     * 
     * @return int
     */
    getSeason()
    {
        return this.m_iSeason;
    }
}

/**
 * SummonerLeague Class
 */
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

    /**
     * Get queue type string
     * 
     * @return string
     */
    getQueueTypeString()
    {
        return this.m_szQueueType;
    }

    /**
     * Get summoner name
     * 
     * @return string
     */
    getSummonerName()
    {
        return this.m_szSummonerName;
    }

    /**
     * Returns true if the player is on a hot streak
     * 
     * @return bool
     */
    isHotStreak()
    {
        return this.m_bHotStreak;
    }

    /**
     * Get MiniSeriesDTO object (promos)
     * 
     * @return MiniSeriesDTO
     */
    getMiniSeries()
    {
        return this.m_MiniSeries;
    }

    /**
     * Get amount of wins
     * 
     * @return int
     */
    getWins()
    {
        return this.m_iWins;
    }

    /**
     * Returns true if player is a veteran
     * 
     * @return bool
     */
    isVeteran()
    {
        return this.m_bVeteran;
    }

    /**
     * Get amount of losses
     * 
     * @return int
     */
    getLosses()
    {
        return this.m_iLosses;
    }

    /**
     * Get rank (IV - III - II - I)
     * 
     * @return string
     */
    getRank()
    {
        return this.m_szRank;
    }

    /**
     * Get league id
     * 
     * @return string
     */
    getLeagueID()
    {
        return this.m_szLeagueID;
    }

    /**
     * Returns true if player is inactive
     * 
     * @return bool
     */
    isInactive()
    {
        return this.m_bInactive;
    }

    /**
     * Returns true if player is new
     * 
     * @return bool
     */
    isFreshBlood()
    {
        return this.m_bFreshBlood;
    }

    /**
     * Get tier (Iron - Challenger)
     * 
     * @return string
     */
    getTier()
    {
        return this.m_szTier;
    }

    /**
     * Get summoner id
     * 
     * @return string
     */
    getSummonerID()
    {
        return this.m_szSummonerID;
    }

    /**
     * Get amount of league points (LP)
     * 
     * @return int
     */
    getLeaguePoints()
    {
        return this.m_iLeaguePoints;
    }

    /**
     * Get queue type enum
     * 
     * @return int
     */
    getQueueTypeE()
    {
        return this.m_eQueueType;
    }

    /**
     * Set queue type enum
     * 
     * @param queue_type        (league.js > QUEUE_TYPE)
     * @return void
     */
    setQueueTypeE(queue_type)
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

module.exports =
{
    Summoner,
    Match,
    
    SUMMONER_API_DATA
};
