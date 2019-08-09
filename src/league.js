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

    /**
     * Get promos progress
     * 
     * N - Not played
     * W - Win
     * L - Loss
     * 
     * returns 'NNN' for rank promo
     * returns 'NNNNN' for tier promo
     * 
     * @return string
     */
    getProgress()
    {
        return this.m_szProgress;
    }

    /**
     * Get promo target
     * 
     * @return int
     */
    getTarget()
    {
        return this.m_iTarget;
    }

    /**
     * Get promo losses
     * 
     * @return int
     */
    getLosses()
    {
        return this.m_iLosses;
    }

    /**
     * Get promo wins
     * 
     * @return int
     */
    getWins()
    {
        return this.m_iWins;
    }
}

/**
 * Convert queue type name to queue type id
 * 
 * @param queue_type      queue type string
 * @return int
 */
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
    MiniSeriesDTO,
    QUEUE_TYPE,
    QueueTypeNameToId
};
