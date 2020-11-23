// Jaké je nejbližší okno s volnou kapacitou?
// nevim jak prochazet atributy
console.info('Jaké je nejbližší okno s volnou kapacitou?');
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


// Kolik volných časových intervalů je k dispozici?
console.info('Kolik volných časových intervalů je k dispozici?');
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
console.info('Jaké je nejbližší nejlevnější okno s volnou kapacitou?');
firstFreeDays = [];
(alasql('SELECT slots FROM ?',[rohlikNormal.data.availabilityDays]).forEach(day => {
    for (const [key, value] of Object.entries(day.slots)) {
        const freeCapasity = (alasql('SELECT timeSlotCapacityDTO->totalFreeCapacityPercent AS freeCapacity FROM ?',[value]));
        if (freeCapasity[0].freeCapacity > 0) {
           firstFreeDays.push({od: value[0].since,
                               do: value[0].till,
                               price: value[0].price}) ;
            break;
        }
    }
}));
lowPriceFree = alasql('SELECT * FROM ? WHERE price=(SELECT MIN(price) FROM ?)', [firstFreeDays, firstFreeDays]);
console.log('Prvni nejlevnejsi okno je: od ' + lowPriceFree[0].od + ' do ' + lowPriceFree[0].do + ' s cenou ' + lowPriceFree[0].price + ' Kc.');
