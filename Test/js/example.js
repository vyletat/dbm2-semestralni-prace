
    alasql("CREATE TABLE cities (city string, population number)");

    alasql("INSERT INTO cities VALUES ('Rome',2863223), ('Paris',2249975), ('Berlin',3517424),  ('Madrid',3041579)");

    var res = alasql("SELECT * FROM cities WHERE population < 3500000 ORDER BY population DESC");

// res now contains this array of object:
// [{"city":"Madrid","population":3041579},{"city":"Rome","population":2863223},{"city":"Paris","population":2249975}]
