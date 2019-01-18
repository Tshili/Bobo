let bot = require('./src/puppeteer');
let cnf = require('./config/config.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('deployement ok');
  bot();
  setInterval(bot, cnf.settings.run_every_x_hours * 3600000);
});

app.listen(port);

//bot();

//setInterval(bot, cnf.settings.run_every_x_hours * 3600000);
