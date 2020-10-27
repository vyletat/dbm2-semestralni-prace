// DATABASE 1
const myDatabase1 = new alasql.Database();
myDatabase1.exec('CREATE TABLE table1 (number INT)');

console.log('Empty table:');
// Asynch
myDatabase1.exec('SELECT * FROM table1', [],
    function (res) {
        console.log(res);
    }
);

// Insert
myDatabase1.exec('INSERT INTO table1 (number) VALUES (1), (2), (3), (4), (5)');

console.log('Table with data:');
// Promise
myDatabase1.exec('SELECT * FROM table1', [],
    function (res) {
        console.log(res);
    }
);
console.log(alasql.databases.myDatabase1);
/*alasql.promise('SELECT * FROM table1')
    .then(function(res){
        // Process data
    }).catch(function(err){
    // Process errors
});*/


// DATABASE 2
const myDatabase2 = new alasql.Database('myDatabase2');
console.log(alasql.databases.myDatabase2);

// Table creation
myDatabase2.exec('CREATE TABLE cities (name string, population number)');
// All columns of table cities
console.table(alasql.databases.myDatabase2.tables.cities.columns);

// Obecna funkce pro vypis
var vypisVsechnaMesta = function() {
    console.table(alasql.databases.myDatabase2.tables.cities.data);
};
const ceskaMesta = [
    {name: 'Prague', population: 1324277},      // Kdyz se sem da string, tak to nepozna, pokud to nejde pres sql
    {name: 'Brno', population: 381346},
    {name: 'Ostrava', population: 287968},
    {name: 'Plzen', population: 174842}
];
// Prirazeni objektu
alasql.databases.myDatabase2.tables.cities.data = ceskaMesta;
vypisVsechnaMesta();

//Insert
myDatabase2.exec("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
vypisVsechnaMesta();

myDatabase2.exec('SELECT * FROM cities', [],
    function (res) {
        console.table(res);
    }
);

// Vysledek query jako promenna
const allCities = myDatabase2.exec("SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC");
console.log(allCities);

// Update
myDatabase2.exec('UPDATE cities SET population = population * 1.5 WHERE name LIKE "A%"');

console.log(alasql.databases.myDatabase2);


alasql('CREATE TABLE cisla (one INT, two INT)');
alasql('INSERT INTO cisla VALUES (1,2), (3,4), (5,6)');
alasql('SELECT * INTO HTML("#sampleTable", {headers:true}) FROM cisla');

myDatabase2.exec('SELECT * INTO HTML("#cities", {headers:true}) FROM cities');

//Custom SQL functions
alasql.fn.myFunction = function (population) {
  return (population / 1000);
};
var result = alasql('SELECT myFunction(population) FROM cities');
console.log(result);
// Jdou i vlastni agregacni funkce

var ins = alasql.databases.myDatabase2.compile('INSERT INTO cities VALUES (?,?)');
ins('mesto1',10);
ins('mesto2',20);
vypisVsechnaMesta();

// Acesss object propertires - obj->property->subproperty
