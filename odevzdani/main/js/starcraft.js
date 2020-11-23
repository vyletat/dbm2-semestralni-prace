/**
 * Kolik hráčů je v jednotlivých divizích/úrovních? (dle JSONů typu A - "member_count")
 *
 * @param tier
 * @param divisionIndex
 */
function sumPlayersFromDivision(tier) {
    //division = alasql('SELECT division FROM ? WHERE id=?', [tier.tier, divisionID]);
    console.info("Kolik hráčů je v jednotlivých divizích/úrovních? (dle JSONů typu A - \"member_count\")");
    let counter = 0;
    for (let i = 0; i < tier.tier.length; i++) {
        memberCount = alasql('SELECT SUM(member_count) AS member_count FROM ?', [tier.tier[i].division]);
        console.log('Tier ' + tier.key.league_id + ' - divize s id ' + tier.tier[i].id + ': ' + memberCount[0].member_count);
        counter  += memberCount[0].member_count;
    }
    console.log('Celkovy pocet hracu v tieru ' + tier.key.league_id + ' je ' + counter);
}
sumPlayersFromDivision(tier5);
sumPlayersFromDivision(tier6);


/**
 * Jsou konzistentní počty hráčů mezi JSON typ A a B? ("member_count" v A vs "team" v B)
 *
 * @param tier
 * @param ladderId
 */
function ladderMemberCountConsist(tier, ladderId) {
    console.info("Jsou konzistentní počty hráčů mezi JSON typ A a B? (\"member_count\" v A vs \"team\" v B)");
    // problem vybrat divizi, rucni zadani ladderu
    count = alasql('SELECT member_count FROM ? WHERE ladder_id= ?;SELECT COUNT(*) AS member_count FROM ?', [tier.tier[0].division, ladderId, ladder230898_1031.team])
    console.log(count);
    console.log('Jsou pocty hracu konzisteni? - ' + (count[0][0].member_count === count[1][0].member_count ? 'ano.' : 'ne.'));
}
ladderMemberCountConsist(tier5, 230898);
// TODO JOIN - jde jen s tabulkami


/**
 * Seřazení hráčů v rámci jednoho ladderu (resp. přes množinu ladderů) dle ELO ("team -> rating").
 *
 * @param ladderJson
 */
function orderPlayersFromLadder(ladderJson) {
    console.info("Seřazení hráčů v rámci jednoho ladderu (resp. přes množinu ladderů) dle ELO (\"team -> rating\").");
    console.log(alasql('SELECT id, rating, member->(0)->character_link->battle_tag AS battle_tag FROM ? ORDER BY rating DESC', [ladderJson.team]));
}
orderPlayersFromLadder(ladder230882_1031);
orderPlayersFromLadder(ladder230889_1031);
orderPlayersFromLadder(ladder230898_1031);


/**
 * Jací hráči vybočují z hranic divizí? (tj. mají ELO jiné než z rozsahu "min_rating" - "max_rating" v A)
 *
 * @param tier
 */
function playersElo(tier, divisionId) {
    console.info("Jací hráči vybočují z hranic divizí? (tj. mají ELO jiné než z rozsahu \"min_rating\" - \"max_rating\" v A)");
    // Najdu min a max divize, najdu vsechny ladder id
    // vzberu vsechny hrace ladderu s id a ELO
    // vzberu hrace, kteri nemaji ELO mezi min a max
    division = alasql('SELECT * FROM ? WHERE id= ?', [tier.tier, divisionId]);
    divisionLadders = alasql("SELECT ladder_id AS lad_id FROM ?", [division[0].division]);
    // nebo - vybereme divizi a JOINem spojime s ladder ID (SELECT ladder.team FROM ladder INNER JOIN division ON division.ladder=ladder.id)
    // hypoteticky - pro kazdy ladder vybereme hrace, kteri nejsou v rozsahu min/max dane divize
    console.log(alasql('SELECT member->(0)->legacy_link->name AS name, rating FROM ? WHERE rating NOT BETWEEN ? AND ?', [ladder230882_1101.team, division[0].min_rating, division[0].max_rating]));
}
playersElo(tier5, 2);


/**
 * Kolik hráčů odehrálo v poslední době nějakou hru? (porovnání "last_played_time_stamp" vůči konstantě např.)
 * 1604079724 = pátek 30. říjen 2020 18:42:04 GMT+01:00
 *
 * @param ladderJson
 * @param timeFromInMilis
 * @returns {undefined|*|RegExpExecArray}
 */
function lastPlayedFrom(ladderJson, timeFromInMilis) {
    console.info("Kolik hráčů odehrálo v poslední době nějakou hru? (porovnání \"last_played_time_stamp\" vůči konstantě např.)");
    console.log(alasql.exec('SELECT COUNT(*) FROM ? WHERE last_played_time_stamp > ?', [ladderJson.team, timeFromInMilis]));
}
lastPlayedFrom(ladder230898_1031, 1604079724);
lastPlayedFrom(ladder230898_1031, 1602957543);


/**
 * Jací hráči jsou v jednom ladderu vícekrát a za jaké rasy ("battle_tag" slouží jako identifikátor účtu, "played_race_count -> race" poskytuje info o herní rase)
 *
 * @param ladderJson
 * @returns {string}
 */
function playerMultiRace(ladderJson) {
    console.info("Jací hráči jsou v jednom ladderu vícekrát a za jaké rasy (\"battle_tag\" slouží jako identifikátor účtu, \"played_race_count -> race\" poskytuje info o herní rase)");
    result = '';
    temp = alasql('SELECT member->(0)->character_link->battle_tag as name, member->(0)->played_race_count->(0)->race as race FROM ?', [ladderJson.team]);
    alasql('SELECT name FROM ? GROUP BY name HAVING COUNT(*) > 1 ORDER BY name', [temp]).forEach(dupPlayer => {
        result += dupPlayer.name + ': '
        temp.forEach(player => {
            if (dupPlayer.name === player.name) {
                result += player.race + ', ';
            }
        });
        result += '\n';
    });
    console.log(result);
}
playerMultiRace(ladder230882_1031);
playerMultiRace(ladder230889_1031);
playerMultiRace(ladder230898_1031);


/**
 * Jací hráči přibyli/ubyli v daných ladderech (srovnání stavů v 20201031 a 20201001)
 *
 * @param ladderJson1
 * @param ladderJson2
 */
function compareLaddersByPlayers(ladderJson1, ladderJson2) {
    console.info("Jací hráči přibyli/ubyli v daných ladderech (srovnání stavů v 20201031 a 20201001)");
    union =  (alasql('SELECT member->(0)->character_link->battle_tag as name FROM ? UNION ALL SELECT member->(0)->character_link->battle_tag as name FROM ?', [ladderJson1.team, ladderJson2.team]));
    console.log(alasql('SELECT name FROM ? GROUP BY name HAVING COUNT(*)=1',[union]));      // nevíme jestli ubyli nebo přibyli
}
compareLaddersByPlayers(ladder230882_1031, ladder230882_1101);


/**
 * Kolik zástupců mají týmy v jednotlivých úrovních ("member -> clan_link" je info o týmu hráče) (info o úrovni ladderu lze získat v JSONu B v "league->league_key->league_id")
 *
 * @param tierJson
 */
function teamsInTier(tierJson) {
    console.info("Kolik zástupců mají týmy v jednotlivých úrovních (\"member -> clan_link\" je info o týmu hráče) (info o úrovni ladderu lze získat v JSONu B v \"league->league_key->league_id\")");
    // vypis vsech ladderu
    let tierLadders = [];
    tierJson.tier.forEach(division => {
        tierLadders.push(alasql("SELECT ladder_id AS lad_id FROM ?", [division.division]));
    });
    // JOIN pres tabulku, kde prvni bude ladder id a druhej sloupec bude nazev ladder souboru
    // SELECT tag, id, COUNT(*) FROM tier INNER JOIN ladders ON league_id=league_id GROUP BY tag
    // pak se kazdy ladder vzpise a udela suma
    let teamsMembersCount = [];
    //console.log(alasql('SELECT member->(0)->clan_link->clan_tag AS tag, member->(0)->clan_link->id AS id ,COUNT(*) AS members FROM ? GROUP BY member->(0)->clan_link->clan_tag',[ladder230889_1031.team]));
    alasql('SELECT member->(0)->clan_link->clan_tag AS tag, member->(0)->clan_link->id AS id ,COUNT(*) AS members FROM ? GROUP BY member->(0)->clan_link->clan_tag',[ladder230889_1031.team]).forEach(item => {
        teamsMembersCount.push(item);
    });
    alasql('SELECT member->(0)->clan_link->clan_tag AS tag, member->(0)->clan_link->id AS id ,COUNT(*) AS members FROM ? GROUP BY member->(0)->clan_link->clan_tag',[ladder230898_1031.team]).forEach(item => {
        teamsMembersCount.push(item);
    });
    alasql('SELECT member->(0)->clan_link->clan_tag AS tag, member->(0)->clan_link->id AS id ,COUNT(*) AS members FROM ? GROUP BY member->(0)->clan_link->clan_tag',[ladder230882_1031.team]).forEach(item => {
        teamsMembersCount.push(item);
    });
    // nad polem se vyberou tymy a spocitaji
    console.log(alasql('SELECT tag, SUM(members) FROM ? GROUP BY tag', [teamsMembersCount]));
}
teamsInTier(tier5);
