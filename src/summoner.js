const Api       = require('./api.js');
const Mastery   = require('./mastery.js');

var SUMMONER_API_DATA =
{
    NONE              : 0,
    CHAMPION_MASTERY  : 1,
    TOTAL_MASTERY     : 2,
    LEAGUE            : 4,
    MATCH_LIST        : 8,
    ACTIVE_GAME       : 16,

    MAX_SUMMONER_API_DATA : 16
}

/**
 * Summoner Class
 *
 */
class Summoner extends Api.ApiObject
{
    /**
     * Constructor
     * 
     * Optional:
     * Calls Summoner.getDataByName
     *
     * @param summoner_name        name of the summoner (string) (json field: name)
     * @param api_callback         function to call when request is complete
     *
     */
    constructor(summoner_name = null, data_flags = 0, api_callback = null)
    {
        super(api_callback);
        
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

        this.m_eRequestStatus     = Api.REQUEST_STATUS.NONE;

        if(summoner_name != null)
            this.getDataByName(summoner_name, data_flags, api_callback);
    }

    /**
     * Gets summoner data from Riot API by summoner name
     *
     * @param summoner_name        name of the summoner (string) (json field: name)
     * @param api_callback         function to call when request is complete
     * @return void
     */
    getDataByName(summoner_name, data_flags = 0, api_callback = null)
    {
        this.m_fApiCallback       = api_callback;
        this.m_eTargetDataFlags   = data_flags;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-name/${summoner_name}`), function(error, response, body){
            Summoner._api_callback(error, response, body, self, SUMMONER_API_DATA.NONE);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted account id
     *
     * @param encrypted_id         encrypted account id (string) (json field: accountId)
     * @param api_callback         function to call when request is complete
     * @return void
     */
    getDataByAccountID(encrypted_id, data_flags = 0, api_callback = null)
    {
        this.m_fApiCallback       = api_callback;
        this.m_eTargetDataFlags   = data_flags;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-account/${encrypted_id}`), function(error, response, body){
            Summoner._api_callback(error, response, body, self, SUMMONER_API_DATA.NONE);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted PUUID (Player Universally Unique IDentifier)
     *
     * @param puu_id              encrypted PUUID (string) (json field: puuid)
     * @param api_callback        function to call when request is complete
     * @return void
     */
    getDataByPUUID(puu_id, data_flags = 0, api_callback = null)
    {
        this.m_fApiCallback       = api_callback;
        this.m_eTargetDataFlags   = data_flags;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/by-puuid/${puu_id}`), function(error, response, body){
            Summoner._api_callback(error, response, body, self, SUMMONER_API_DATA.NONE);
        });
    }

    /**
     * Gets summoner data from Riot API by encrypted summoner id
     *
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete
     * @return void
     */
    getDataBySummonerID(summoner_id, data_flags = 0, api_callback = null)
    {
        this.m_fApiCallback       = api_callback;
        this.m_eTargetDataFlags   = data_flags;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/summoner/v4/summoners/${summoner_id}`), function(error, response, body){
            Summoner._summoner_api_callback(error, response, body, self, SUMMONER_API_DATA.NONE);
        });
    }

    /**
     * Gets total mastery score from Riot API by encrypted summoner id
     *
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete
     * @return void
     */
    getTotalMasteryScore(summoner_id, api_callback = null)
    {
        this.m_fApiCallback = api_callback;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/scores/by-summoner/${summoner_id}`), function(error, response, body){
            Summoner._summoner_api_callback(error, response, body, self, SUMMONER_API_DATA.TOTAL_MASTERY);
        });
    }

    /**
     * Gets all summoner champion masteries from Riot API by encrypted summoner id
     *
     * @param summoner_id         summoner id (string) (json field: id)
     * @param api_callback        function to call when request is complete
     * @return void
     */
    getChampionMasteries(summoner_id, api_callback = null)
    {
        this.m_fApiCallback = api_callback;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}`), function(error, response, body){
            Summoner._summoner_api_callback(error, response, body, self, SUMMONER_API_DATA.CHAMPION_MASTERY);
        });
    }

    /**
     * Make sure to use summoner.<member> instead of this.<member> in this function
     */
    static _summoner_api_callback(error, response, body, summoner, type)
    {
        // Add flag to current data flags
        summoner.m_eCurrentDataFlags |= type;

        var validCall = Api.IsValidApiCall(response.statusCode);
        
        summoner.m_eRequestStatus = Api.REQUEST_STATUS.DONE;
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var json = {};
        if(validCall)
        {
            json = JSON.parse(body);
            
            switch(type)
            {
                case SUMMONER_API_DATA.NONE:
                    summoner.parseSummonerJSON(json);
                    break;
                case SUMMONER_API_DATA.CHAMPION_MASTERY:
                    summoner.parseChampionMasteryJSON(json);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.parseTotalMasteryJSON(json);
                    break;
                case SUMMONER_API_DATA.LEAGUE:

                    break;
                case SUMMONER_API_DATA.MATCH_LIST:

                    break;
                case SUMMONER_API_DATA.ACTIVE_GAME:

                    break;
            }
        }

        // If we're done with all API calls
        if(summoner.m_eCurrentDataFlags == summoner.m_eTargetDataFlags)
        {
            // If no callback was passed, just return
            if(summoner.m_fApiCallback == null)
                return;

            summoner.m_fApiCallback(summoner, validCall);
        }
        else
        {
            // If we still have API calls to complete

            // While bit is a bit flag set in target flags AND
            // bit is not a flag thats set in currnet flags AND
            // bit is less than max bit flags in SUMMONER_API_DATA enum

            var bit = 1;
            for(; bit < SUMMONER_API_DATA.MAX_SUMMONER_API_DATA; bit *= 2)
            {
                if(bit & summoner.m_eTargetDataFlags && !(bit & summoner.m_eCurrentDataFlags))
                    break;
            }
            
            switch(bit)
            {
                case SUMMONER_API_DATA.CHAMPION_MASTERY:
                    summoner.getChampionMasteries(summoner.m_szSummonerID, summoner.m_fApiCallback);
                    break;
                case SUMMONER_API_DATA.TOTAL_MASTERY:
                    summoner.getTotalMasteryScore(summoner.m_szSummonerID, summoner.m_fApiCallback);
                    break;
                case SUMMONER_API_DATA.LEAGUE:

                    break;
                case SUMMONER_API_DATA.MATCH_LIST:

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
        this.m_szName = json.name;
        this.m_szPUUID = json.puuid;
        this.m_iSummonerLevel = json.summonerLevel;
        this.m_iRevisionDate = json.revisionDate;
        this.m_szSummonerID = json.id;
        this.m_szAccountID = json.accountId;
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
       // console.log(json.length);
        for(var i = 0; i < json.length; i++)
        {
            var mastery = new Mastery.Mastery();
            mastery.parseMasteryJSON(json[i]);
            this.m_ChampionMasteries.push(mastery);
        }

        for(var i = 0; i < this.m_ChampionMasteries.length; i++)
        {
            console.log(this.m_ChampionMasteries[i].m_iChampionID);
        }
    }
}

module.exports =
{
    Summoner,
    
    SUMMONER_API_DATA: SUMMONER_API_DATA
};
