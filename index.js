const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const blurhashRouter = require('./api/blurhash');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/', blurhashRouter);

app.listen(3500, () => {
  console.log('up and running')
});

module.exports = app;