const Api       = require('./api.js');

/**
 * Mastery Class
 *
 */
class Mastery extends Api.ApiObject
{
    constructor(summoner_id = null, champion_id = null, api_callback = null)
    {
        super(api_callback);

        this.m_bChestGranted = false;
        this.m_iChampionLevel = -1;
        this.m_iChampionPoints = -1;
        this.m_iChampionID = -1;
        this.m_iChampionPointsUntilNextLevel = -1;
        this.m_iLastPlayTime = -1;
        this.m_iTokensEarned = -1;
        this.m_iChampionPointsSinceLastLevel = -1;
        this.m_szSummonerID = null;

        this.m_eRequestStatus = Api.REQUEST_STATUS.NONE;

        if(summoner_id != null && champion_id != null)
            this.getData(summoner_id, api_callback);
    }

    /**
     * Gets champion mastery data from Riot API by summoner id
     *
     * @param summoner_id          summoner id (string) (json field: id)
     * @param api_callback         function to call when request is complete
     * @return void
     */
    getData(summoner_id, champion_id, api_callback = null)
    {
        this.m_fApiCallback = api_callback;

        this.m_eRequestStatus = Api.REQUEST_STATUS.REQUESTING; 
        var self = this;
        Api.Request(Api.BuildURL(`lol/champion-mastery/v4/champion-masteries/by-summoner/${summoner_id}/by-champion/${champion_id}`), function(error, response, body){
            Mastery._mastery_api_callback(error, response, body, self);
        });
    }

    static _mastery_api_callback(error, response, body, mastery)
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
        if(mastery.m_fApiCallback != null)
            mastery.m_fApiCallback(mastery, validCall);
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
}

module.exports =
{
	Mastery
};
