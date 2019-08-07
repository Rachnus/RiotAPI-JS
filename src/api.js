const Request             = require('request');
const ApiKey              = require('../apikey.js');

var REQUEST_STATUS =
{
    INVALID:   -1,
    NONE:       0,
    REQUESTING: 1,
    DONE:       2
}


/**
 * ApiObject Class
 * 
 * api_callback prototype: function(<json>, <success>)
 * @param json       json data from api request
 * @param success    wether or not the api call was successful (status code 200)
 */
class ApiObject
{
    constructor(api_callback = null)
    {
        this.m_fApiCallback = api_callback;
        this.m_eRequestStatus = REQUEST_STATUS.NONE;
    }
}

function BuildURL(api_path)
{
    return BuildCustomURL(ApiKey.API_URL, api_path, ApiKey.API_KEY);
}

function BuildCustomURL(api_url, api_path, api_key)
{
    return api_url + '/' + api_path + '?api_key=' + api_key;
}

function IsValidApiCall(status_code)
{
    return status_code == 200;
}

var RIOT_HTTP_STATUS_CODE =
{
    BAD_REQUEST            : 400,
    UNAUTHORIZED           : 401,
    FORBIDDEN              : 403,
    DATA_NOT_FOUND         : 404,
    METHOD_NOT_ALLOWED     : 405,
    UNSUPPORTED_MEDIA_TYPE : 415,
    RATE_LIMIT_EXCEEDED    : 429,
    INTERNAL_SERVER_ERROR  : 500,
    BAD_GATEWAY            : 502,
    SERVICE_UNAVAILABLE    : 503,
    GATEWAY_TIMEOUT        : 504
}

module.exports =
{
    REQUEST_STATUS:       REQUEST_STATUS,
    ApiKey:               ApiKey,
    Request:              Request,

    ApiObject,

    BuildURL:             BuildURL,
    BuildCustomURL:       BuildCustomURL,
    IsValidApiCall:       IsValidApiCall
};
