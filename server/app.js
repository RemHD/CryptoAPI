const express = require('express');
const bodyparser = require('body-parser');
const movieRouter = require('./routes/movies');
const cryptoRouter = require('./routes/crypto');

const app = express();

app.use(bodyparser.json());

app.use('/movies', movieRouter);
app.use('/crypto', cryptoRouter);

app.listen(3000, () => console.log('Listening'));