const express = require('express');
const app = express();              // instance of express
const path = require('path');
const router = express.Router();


app.use('/data', express.static('data'));           // muze zobrazit vsechny soubory ve slozce data, napr. http://localhost:3000/data/rohlik/rohlik1.json
app.use('/js', express.static('js'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/rohlik', function (req, res) {
    res.sendFile(path.join(__dirname+'/pages/rohlik.html'));
});

app.get('/starcraft', function (req, res) {
    res.sendFile(path.join(__dirname+'/pages/starcraft.html'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
