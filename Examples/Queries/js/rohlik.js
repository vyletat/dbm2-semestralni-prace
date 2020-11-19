/* Inicializace databaze*/
const rohlikDb = new alasql.Database('rohlikDb');
/* Vytvoreni tabulek */
rohlikDb.exec('CREATE TABLE Day (id number)');

console.log(alasql.fn);

/*console.log(alasql('SELECT slots FROM (SELECT VALUE CONCAT(availabilityDays) FROM ?)',[rohlikPremium.data]))*/

// User-defined aggregator to concat arrays
alasql.aggr.CONCAT = function(v,s) {
    return (s||[]).concat(v);
};

// Jaké je nejbližší okno s volnou kapacitou?
// nevim jak prochazet atributy
(alasql('SELECT slots FROM ?',[rohlikPremium.data.availabilityDays]).forEach(day => {
    // nevím jak procházet přes knihovnu atributy
    for (const [key, value] of Object.entries(day.slots)) {
        const freeCapasity = (alasql('SELECT timeSlotCapacityDTO->totalFreeCapacityPercent AS freeCapacity FROM ?',[value]));
        if (freeCapasity[0].freeCapacity > 0) {
            console.log('Prvni volne okenko dne je: ' + value[0].since + ' do ' + value[0].till) ;
            break;
        }
    }
}));
// Intersect - spojená více selectu do jednoho

// vytazeni vsech okenek
console.log(alasql('SELECT slots->8->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 8,' +
    'slots->9->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 9,' +
    'slots->10->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 10,' +
    'slots->11->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 11,' +
    'slots->12->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 12,' +
    'slots->13->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 13,' +
    'slots->14->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 14,' +
    'slots->15->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 15,' +
    'slots->16->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 16,' +
    'slots->17->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 17,' +
    'slots->18->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 18,' +
    'slots->19->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 19,' +
    'slots->20->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent AS 20' +
    ' FROM (SELECT slots FROM ?)',[rohlikPremium.data.availabilityDays]));

console.log(alasql('SELECT ARRAY(slots->8->(0)->timeSlotCapacityDTO->totalFreeCapacityPercent)' +
    ' FROM (SELECT slots FROM ?)',[rohlikPremium.data.availabilityDays]));

// Kolik volných časových intervalů je k dispozici?
(alasql('SELECT slots FROM ?',[rohlikPremium.data.availabilityDays]).forEach(day => {
    counter = 0;
    for (const [key, value] of Object.entries(day.slots)) {
        const freeCapasity = (alasql('SELECT timeSlotCapacityDTO->totalFreeCapacityPercent AS freeCapacity FROM ?',[value]));
        if (freeCapasity[0].freeCapacity > 0) {
            counter++;
        }
    }
    console.log('Den ma ' + counter + ' volnych dodavkovych okenek.')
}));

// Jaké je nejbližší nejlevnější okno s volnou kapacitou?
