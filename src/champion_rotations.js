const Api       = require('./api.js');

/**
 * Rotations Class
 *
 */
class ChampionRotations
{
    constructor(api_callback = null)
    {
        this.m_FreeChampionIdsForNewPlayers  = [];
        this.m_FreeChampionIds               = [];
        this.m_iMaxNewPlayerLevel            = 0;

        if(api_callback != null)
            this.queryData(api_callback);
    }

     /**
     * Gets champion rotation data from Riot API
     *
     * @param api_callback         function to call when request is complete
     * @return void
     */
    queryData(api_callback = null)
    {
        var self = this;
        Api.Request(Api.BuildURL(`lol/platform/v3/champion-rotations`), function(error, response, body){
            ChampionRotations._champion_rotations_api_callback(error, response, body, api_callback, self);
        });
    }

    static _champion_rotations_api_callback(error, response, body, api_callback, champion_rotations)
    {
        var validCall = Api.IsValidApiCall(response.statusCode);

        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var json = {};
        if(validCall)
            json = JSON.parse(body);
        
        champion_rotations.parseChampionRotationJSON(json);
        if(api_callback != null)
            api_callback(champion_rotations, validCall);
    }

    /**
     * Parses champion rotation JSON data and fills member variables
     *
     * returns true if json data was parsed successfully
     *
     * @param json                 json data (string)
     * @return bool
     */
    parseChampionRotationJSON(json)
    {
        for(var i = 0; i < json.freeChampionIdsForNewPlayers.length; i++)
        {
            this.m_FreeChampionIdsForNewPlayers.push(json.freeChampionIdsForNewPlayers[i]);
        }

        for(var i = 0; i < json.freeChampionIds.length; i++)
        {
            this.m_FreeChampionIds.push(json.freeChampionIds[i]);
        }

        this.m_iMaxNewPlayerLevel = json.maxNewPlayerLevel;
    }
}

module.exports =
{
	ChampionRotations
};
