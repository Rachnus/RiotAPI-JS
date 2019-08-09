const Api        = require('../api.js');
const DataDragon = require('./url.js');

g_Champions        = new Map();    // <champion_id(int)>      <Champion>
g_ChampionNameToId = new Map();    // <champion_name(string)> <champion_id>

// Example:
// http://ddragon.leagueoflegends.com/cdn/9.15.1/data/en_US/champion.json


/**
 * Query champion data from ddragon
 * 
 * @param api_callback       function to call when champion data has been received
 * @return void
 */
function QueryChampionData(api_callback = null, patch = DataDragon.DDRAGON_PATCH, language = DataDragon.DDRAGON_LANGUAGE)
{
    var finalUrl = `${DataDragon.DDRAGON_URL}/cdn/${patch}/data/${language}/champion.json`;
    console.log(`Grabbing champion data from ${finalUrl}...`);
    var self = this;
    Api.Request(`${DataDragon.DDRAGON_URL}/cdn/${patch}/data/${language}/champion.json`, 
    function(error, response, body)
    {
        var json = JSON.parse(body);

        if(error != null|| json.type == null || json.type != 'champion')
        {
            var jsonType = '';
            if(json.type != null)
                jsonType = 'Type: ' + json.type;

            throw `Could not grab champion data from ${finalUrl}.\nError:${error}\n${jsonType}`;
        }

        var jsonChampions = json.data;
        for(var key in jsonChampions)
        {
            var jsonChampion = jsonChampions[key];

            var info = new Info(jsonChampion.info.attack,
                                jsonChampion.info.defense,
                                jsonChampion.info.magic,
                                jsonChampion.info.difficulty);
            
            var image = new Image(jsonChampion.image.full,
                                  jsonChampion.image.sprite,
                                  jsonChampion.image.group,
                                  jsonChampion.image.x,
                                  jsonChampion.image.y,
                                  jsonChampion.image.w,
                                  jsonChampion.image.h);
            
            var stats = new Stats(jsonChampion.stats.hp,
                                  jsonChampion.stats.hpperlevel,
                                  jsonChampion.stats.mpperlevel,
                                  jsonChampion.stats.movespeed,
                                  jsonChampion.stats.armor,
                                  jsonChampion.stats.armorperlevel,
                                  jsonChampion.stats.spellblock,
                                  jsonChampion.stats.spellblockperlevel,
                                  jsonChampion.stats.attackrange,
                                  jsonChampion.stats.hpregen,
                                  jsonChampion.stats.hpregenperlevel,
                                  jsonChampion.stats.mpregen,
                                  jsonChampion.stats.mpregenperlevel,
                                  jsonChampion.stats.crit,
                                  jsonChampion.stats.critperlevel,
                                  jsonChampion.stats.attackdamage,
                                  jsonChampion.stats.attackdamageperlevel,
                                  jsonChampion.stats.attackspeedperlevel,
                                  jsonChampion.stats.attackspeed);

            var champId = parseInt(jsonChampion.key, 10);
            var champ = new Champion(jsonChampion.version,
                                     jsonChampion.id,
                                     champId,
                                     jsonChampion.name,
                                     jsonChampion.title,
                                     jsonChampion.blurb,
                                     info,
                                     image,
                                     jsonChampion.tags,
                                     jsonChampion.partype,
                                     stats);

            g_ChampionNameToId.set(champ.m_szName, champId);
            g_Champions.set(champId, champ);
        }
        console.log('Done!');
        api_callback();
    });
}

/**
 * Get champion object by name
 * 
 * @param champion_name       name of champion
 * @return Champion
 */
function GetChampionByName(champion_name)
{
    console.log(g_ChampionNameToId.get(champion_name));
    return g_Champions.get(g_ChampionNameToId.get(champion_name));
}

/**
 * Get champion object by champion id
 * 
 * @param champion_id       id of champion
 * @return Champion
 */
function GetChampionByID(champion_id)
{
    return g_Champions.get(champion_id);
}

/**
 * Info Class
 */
class Info 
{
    constructor(attack = null,
                defense = null,
                magic = null,
                difficulty = null)
    {
        this.m_iAttack = attack;
        this.m_iDefense = defense;
        this.m_iMagic = magic;
        this.m_iDifficulty = difficulty;
    }
}

/**
 * Image Class
 */
class Image 
{
    constructor(full = null,
                sprite = null,
                group = null,
                x = null,
                y = null,
                w = null,
                h = null)
    {
        this.m_szFull = full;
        this.m_szSprite = sprite;
        this.m_szGroup = group;
        this.m_iX = x;
        this.m_iY = y;
        this.m_iWidth = w;
        this.m_iHeight = h;
    }
}

/**
 * Stats Class
 */
class Stats 
{
    constructor(hp = null,
                hp_per_level = null,
                mp = null, // Key
                mp_per_level = null, 
                move_speed = null,
                armor = null,
                armor_per_level = null,
                spell_block = null,
                spell_block_per_level = null,
                attack_range = null,
                hp_regen = null,
                hp_regen_per_level = null,
                mp_regen = null,
                mp_regen_per_level = null,
                crit = null,
                crit_per_level = null,
                attack_damage = null,
                attack_damage_per_level = null,
                attack_speed_per_level = null,
                attack_speed = null)
    {
        this.m_iHealth = hp;
        this.m_iHealthPerLevel = hp_per_level;
        this.m_iMana = mp;
        this.m_iManaPerLevel = mp_per_level;
        this.m_iMovementSpeed = move_speed;
        this.m_iArmor = armor;
        this.m_iArmorPerLevel = armor_per_level;
        this.m_iMagicResist = spell_block; // Spellblock
        this.m_iMagicResistPerLevel = spell_block_per_level; // Spellblock per level
        this.m_iAttackRange = attack_range;
        this.m_iHealthRegen = hp_regen;
        this.m_iHealthRegenPerLevel = hp_regen_per_level;
        this.m_iManaRegen = mp_regen;
        this.m_iManaRegenPerLevel = mp_regen_per_level;
        this.m_iCrit = crit;
        this.m_iCritPerLevel = crit_per_level;
        this.m_iAttackDamage = attack_damage;
        this.m_iAttackDamagePerLevel = attack_damage_per_level;
        this.m_iAttackSpeedPerLevel = attack_speed_per_level;
        this.m_iAttackSpeed = attack_speed;
    }
}

/**
 * Champion Class
 */
class Champion
{
    constructor(version = null,
                id = null,
                champion_id = null, // Key
                name = null, 
                title = null,
                blurb = null,
                info = null,
                image = null,
                tags = null,
                partype = null,
                stats = null)
    {
        this.m_szVersion = version;
        this.m_szID = id;
        this.m_iChampionID = champion_id;
        this.m_szName = name;
        this.m_szTitle = title;
        this.m_szBlurb = blurb;
        this.m_Info = info;
        this.m_Image = image;
        this.m_Tags = tags;
        this.m_szPartype = partype;
        this.m_Stats = stats;
    }

    /**
     * Get champion name
     * 
     * @return string
     */
    getName()
    {
        return this.m_szName;
    }

    /**
     * Get champion title
     * 
     * @return string
     */
    getTitle()
    {
        return this.m_szTitle;
    }

    /**
     * Get champion description (blurb)
     * 
     * @return string
     */
    getDescription()
    {
        return this.m_szBlurb;
    }

    /**
     * Get champion stats object
     * 
     * @return Stats
     */
    getStats()
    {
        return this.m_Stats;
    }

    /**
     * Get champion info object
     * 
     * @return Info
     */
    getInfo()
    {
        return this.m_szInfo;
    }

    /**
     * Get champion image object
     * 
     * @return Image
     */
    getImage()
    {
        return this.m_Image;
    }
}

module.exports =
{
    Champion,
    Stats,
    Image,
    Info,

    QueryChampionData,
    GetChampionByName,
    GetChampionByID,

    champions: g_Champions
};