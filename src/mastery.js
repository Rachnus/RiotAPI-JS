const Api       = require('./api.js');

/**
 * Mastery Class
 *
 */
class Mastery
{
    constructor(summoner_id = null, champion_id = null, api_callback = null)
    {
        this.m_bChestGranted = false;
        this.m_iChampionLevel = -1;
        this.m_iChampionPoints = -1;
        this.m_iChampionID = -1;
        this.m_iChampionPointsUntilNextLevel = -1;
        this.m_iLastPlayTime = -1;
        this.m_iTokensEarned = -1;
        this.m_iChampionPointsSinceLastLevel = -1;
        this.m_szSummonerID = null;

        if(summoner_id != null && champion_id != null)
            this.queryData(summoner_id, api_callback);
    }

    /**
     * Gets champion mastery data from Riot API by summoner id
     *
     * @param summoner_id          summoner id (string) (json field: id)
     * @param api_callback         function to call when request is complete
     * @return void
     */
    queryData(summoner_id, champion_id, api_callback = null)
    {
        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}/by-champion/${champion_id}`), function(error, response, body){
            Mastery._mastery_api_callback(error, response, body, api_callback, self);
        });
    }

    static _mastery_api_callback(error, response, body, api_callback, mastery)
    {
        var validCall = Api.IsValidApiCall(response.statusCode);
        
        mastery.m_eRequestStatus = Api.REQUEST_STATUS.DONE;
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var json = {};
        if(validCall)
            json = JSON.parse(body);
        
        mastery.parseMasteryJSON(json);
        if(api_callback != null)
            api_callback(mastery, validCall);
    }

    /**
     * Parses mastery JSON data and fills member variables
     *
     * returns true if json data was parsed successfully
     *
     * @param json                 json data (string)
     * @return bool
     */
    parseMasteryJSON(json)
    {
        this.m_bChestGranted = json.chestGranted;
        this.m_iChampionLevel = json.championLevel;
        this.m_iChampionPoints = json.championPoints;
        this.m_iChampionID = json.championId;
        this.m_iChampionPointsUntilNextLevel = json.championPointsUntilNextLevel;
        this.m_iLastPlayTime = json.lastPlayTime;
        this.m_iTokensEarned = json.tokensEarned;
        this.m_iChampionPointsSinceLastLevel = json.championPointsSinceLastLevel;
        this.m_szSummonerID = json.summonerId;
    }

    /**
     * Parses champion mastery JSON data (List)
     *
     * @param json                 json data (string)
     * @return Mastery[]
     */
    static parseChampionMasteriesJSON(json)
    {
        var masteries = new Map();
        for(var i = 0; i < json.length; i++)
        {
            var mastery = new Mastery();
            mastery.parseMasteryJSON(json[i]);
            masteries.set(mastery.m_iChampionID, mastery);
        }
        return masteries;
    }

    /**
     * Parses total mastery score JSON data
     *
     * @param json                 json data (string)
     * @return int
     */
    static parseTotalMasteryJSON(json)
    {
        return json;
    }

    /**
     * Returns true if chest is granted
     * 
     * @return bool
     */
    isChestGranted()
    {
        return this.m_bChestGranted;
    }

    /**
     * Get champion level
     * 
     * @return int
     */
    getChampionLevel()
    {
        return this.m_iChampionLevel;
    }

    /**
     * Get champion points
     * 
     * @return int
     */
    getChampionPoints()
    {
        return this.m_iChampionPoints;
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
     * Get champion points until next level
     * 
     * @return int
     */
    getChampionPointsUntilNextLevel()
    {
        return this.m_iChampionPointsUntilNextLevel;
    }

    /**
     * Get last play time
     * 
     * @return int
     */
    getLastPlayTime()
    {
        return this.m_iLastPlayTime;
    }

    /**
     * Get tokens earned
     * 
     * @return int
     */
    getTokensEarned()
    {
        return this.m_iTokensEarned;
    }

    /**
     * Get champion points since last level
     * 
     * @return int
     */
    getChampionPointsSinceLastLevel()
    {
        return this.m_iChampionPointsSinceLastLevel;
    }

    /**
     * Get csummoner id
     * 
     * @return string
     */
    getSummonerID()
    {
        return this.m_szSummonerID;
    }
}

module.exports =
{
	Mastery
};
