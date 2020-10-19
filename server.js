
const express = require('express');
const bodyparser = require('body-parser');
const engines = require('consolidate');
const path = require('path');
const passport = require('passport');
const logger = require ('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()


//--- port server connection ---//

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
{
    console.log(`Server is ready for connections on port ${PORT}`);
});

//--- mongo connection ---//

mongoose.connect( process.env.MONGO_DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
   });

mongoose.connection.on('connected', () =>
{
   console.log('Connected to the database');
});
mongoose.connection.on('error', (err) =>
{
   console.error(`Failed to connected to the database: ${err}`);
});

//--- meddilwares ---//

app.use(logger('dev'));

// body-parser //
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

 // passport //
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


// set static directories
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', engines.mustache);

//--- Routes ---//
const intro = require('./routes/intro');
app.use('/intro',intro);

const login = require('./routes/login');
app.use('/login',login);

const register = require('./routes/register');
app.use('/register',register);



//--- Errors ---//

app.use((req, res, next) =>
{
     //404 Not Found
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) =>
{
    const status = err.status || 500;
    const error = err.message || 'Error processing your request';

    res.status(status).send
    ({
        error
    })
});


module.exports = app ;



