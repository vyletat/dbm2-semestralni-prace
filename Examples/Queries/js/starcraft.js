/* Inicializace */


/* Kolik hráčů je v jednotlivých divizích/úrovních? (dle JSONů typu A - "member_count") */
const starcraftDatabase = new alasql.Database('starcraftDatabase');
/*starcraftDatabase.exec('CREATE TABLE tier (league_id number)');
starcraftDatabase.exec('CREATE TABLE division (min_rating number, id number, max_rating number)');
starcraftDatabase.exec('CREATE TABLE ledder (ladder_id number, id number, member_count number)');*/

/* Tier 5 - Division_id 0 */
console.log('Tier 5 - Division_id 0');
console.log(alasql('SELECT SUM(member_count) FROM ?', [tier5.tier[0].division]));

/* Pro každou Division */
for (let i = 0; i < tier5.length; i++) {
    let ledders = alasql('SELECT SUM(member_count) FROM ?', [tier5[i].division]);
    console.log('Ledder ' + i + ':');
    console.log(ledders);
}

/*
var tiers = alasql('SELECT division FROM ?',[tier5.tier]);
console.log(tiers);
var array = alasql('SELECT [] FROM ?',[tiers]);
*/

/*var ladders = alasql('SELECT division->0 FROM ' +
    '(SELECT division FROM ?)',[tier5.tier]);
/!*console.log(tiers);*!/
console.log(ladders);*/

/*var data = [1,2,3,4,3,2,3,4,5,3,2,1,1,1,2];
var res = alasql('SELECT INDEX _, COUNT(*) FROM ? GROUP BY _',[data]);
console.log(res);*/

/*var test = alasql('SELECT INDEX _, division FROM ?',[tier5.tier]);
console.log(test);*/

/*var data = [
    [2014, 1, 1], [2015, 2, 1],
    [2016, 3, 1], [2017, 4, 2],
    [2018, 5, 3], [2019, 6, 3]
];
var res = alasql('SELECT SUM([1]) FROM ? d WHERE [0]>2016', [data]);
console.log(res);
var res1 = alasql.arrayOfArrays('SELECT * FROM ? a WHERE [0]>2016', [data]);
var res2 = data.filter(function(a){return a[0]>2016});
console.log(alasql);*/


/* Jsou konzistentní počty hráčů mezi JSON typ A a B? ("member_count" v A vs "team" v B) */
console.log(alasql('SELECT member_count FROM ? WHERE ladder_id=230898', [tier5.tier[0].division]));
console.log(alasql('SELECT COUNT(*) FROM ?', [ladder230898.team]));

/* Seřazení hráčů v rámci jednoho ladderu (resp. přes množinu ladderů) dle ELO ("team -> rating"). */
console.log(alasql('SELECT * FROM ? ORDER BY rating DESC', [ladder230898.team]));

/* Jací hráči vybočují z hranic divizí? (tj. mají ELO jiné než z rozsahu "min_rating" - "max_rating" v A) */

/* Kolik hráčů odehrálo v poslední době nějakou hru? (porovnání "last_played_time_stamp" vůči konstantě např.) */
/* 1604079724 = pátek 30. říjen 2020 18:42:04 GMT+01:00 */
console.log(alasql('SELECT COUNT(*) FROM ? WHERE last_played_time_stamp > 1604079724', [ladder230898.team]));

/* Jací hráči jsou v jednom ladderu vícekrát a za jaké rasy ("battle_tag" slouží jako identifikátor účtu, "played_race_count -> race" poskytuje info o herní rase) */

/* Jací hráči přibyli/ubyli v daných ladderech (srovnání stavů v 20201031 a 20201001) */

/* Kolik zástupců mají týmy v jednotlivých úrovních ("member -> clan_link" je info o týmu hráče) (info o úrovni ladderu lze získat v JSONu B v "league->league_key->league_id")
 */
