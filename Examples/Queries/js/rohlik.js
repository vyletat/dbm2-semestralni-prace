/*console.log(alasql('SELECT slots FROM (SELECT VALUE CONCAT(availabilityDays) FROM ?)',[rohlikPremium.data]))*/

// User-defined aggregator to concat arrays
alasql.aggr.CONCAT = function(v,s) {
    return (s||[]).concat(v);
};
console.log(alasql('SELECT slots FROM ?',[rohlikPremium.data.availabilityDays]));

(alasql('SELECT slots FROM ?',[rohlikPremium.data.availabilityDays]).forEach(day => {
    // console.log(alasql('SELECT timeSlotCapacityDTO->totalFreeCapacityPercent FROM ?',[hour[0]]));
    for (const [key, value] of Object.entries(day.slots)) {
        const freeCapasity = (alasql('SELECT timeSlotCapacityDTO->totalFreeCapacityPercent AS freeCapacity FROM ?',[value]));
        if (freeCapasity[0].freeCapacity > 0) {
            console.log(value[0].since);
        }
    }
}));
