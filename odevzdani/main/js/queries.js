alasql('ATTACH FILESTORAGE DATABASE test("./js/file.json")', function () {
    console.log(alasql.databases.test.data);
});

alasql('ATTACH FILESTORAGE DATABASE test2("./js/file.json");USE test2;',function () {
    console.log();
    console.log(alasql.databases);
});


// Založení první databáze
const myDatabase1 = new alasql.Database();
// Založení tabulky
myDatabase1.exec('CREATE TABLE table1 (number INT)');
// Insert
myDatabase1.exec('INSERT INTO table1 (number) VALUES (1), (2), (3), (4), (5)');

// Asynch
myDatabase1.exec('SELECT * FROM table1', [],        // callback
    function (res) {
        console.log(res);
    }
);


// Založení druhé databáze
const myDatabase2 = new alasql.Database('myDatabase2');
// Table creation
myDatabase2.exec('CREATE TABLE cities (name string, population number)');

// All columns of table cities
console.table(alasql.databases.myDatabase2.tables.cities.columns);

// Obecna funkce pro vypis
var vypisVsechnaMesta = function() {
    console.table(alasql.databases.myDatabase2.tables.cities.data);
};

// Data s ceskymi mesty
const ceskaMesta = [
    {name: 'Prague', population: 1324277},      // Kdyz se sem da string, tak to nepozna, pokud to nejde pres sql
    {name: 'Brno', population: 381346},
    {name: 'Ostrava', population: 287968},
    {name: 'Plzen', population: 174842}
];

// Prirazeni objektu
alasql.databases.myDatabase2.tables.cities.data = ceskaMesta;
vypisVsechnaMesta();        // vypis vsech mest
//Insert
myDatabase2.exec("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
vypisVsechnaMesta();        // vypis vsech mest

// Vysledek query jako promenna
const allCities = myDatabase2.exec("SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC");
console.log(allCities);

// Update
myDatabase2.exec('UPDATE cities SET population = population * 1.5 WHERE name LIKE "A%"');
console.log(alasql.databases.myDatabase2);

alasql('CREATE TABLE cisla (one INT, two INT)');
alasql('INSERT INTO cisla VALUES (1,2), (3,4), (5,6)');
// Vypis dotazu do HTML jako tabulka
//alasql('SELECT * INTO HTML("#sampleTable", {headers:true}) FROM cisla');
//myDatabase2.exec('SELECT * INTO HTML("#cities", {headers:true}) FROM cities');

var data = [
    {a:{b:1,c:1}},
    {a:{b:2}},
    {a:{b:4}}
    ];
// Vyber pomoci odkazu na promenou obj->property->subproperty
var res = alasql('SELECT a->b FROM ?',[data]);
console.log(res);

//Custom SQL functions
alasql.fn.myFunction = function (population) {
  return (population / 1000);
};
var result = myDatabase2.exec('SELECT myFunction(population) FROM cities');
console.log(result);

/*
* Jdou i vlastni funkce pro manipulaci - NEFUNGUJE
* funkce compile()
* */
/*var ins = alasql.compile('INSERT INTO cisla VALUES (?,?)');
ins(10,10);
ins(20,20);
vypisVsechnaMesta();*/

// AST
var ast = alasql.parse("SELECT * FROM one");
console.log(ast);
console.log(ast.toString()); // Print restored SQL statement

// Zkouška callbacku a načtení souboru - NEFUNGUJE
/*alasql.exec(['SELECT * FROM json(?)'], ["../Data/ladders-eu-230882.json"], function(res){
    console.log(res); // output depends on mydata.xls
});*/

// Promise - NEFUNGUJE
alasql.promise('SELECT * FROM cisla')
    .then(function(res){
        console.log(res);
    }).catch(function(err){
    // Process errors
});
