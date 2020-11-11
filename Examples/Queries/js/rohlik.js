/*console.log(alasql('SELECT slots FROM (SELECT VALUE CONCAT(availabilityDays) FROM ?)',[rohlikPremium.data]))*/

// User-defined aggregator to concat arrays
alasql.aggr.CONCAT = function(v,s) {
    return (s||[]).concat(v);
};

// Jaké je nejbližší okno s volnou kapacitou?
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
