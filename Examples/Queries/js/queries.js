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

myDatabase2.exec('CREATE TABLE cities (name string, population number)');

myDatabase2.exec("INSERT INTO cities VALUES ('Rome',2863223),('Paris',2249975),('Berlin',3517424),('Madrid',3041579)");
myDatabase2.exec('SELECT * FROM cities', [],
    function (res) {
        console.log(res);
    }
);

const allCities = myDatabase2.exec("SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC");
console.log(allCities);

myDatabase2.exec('UPDATE cities SET population = population * 1.5 WHERE name LIKE "A%"');
