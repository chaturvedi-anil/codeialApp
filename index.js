const express= require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app= express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// setting body parser middileware
app.use(express.urlencoded());

// setting cookies parser
app.use(cookieParser());

// statics files
app.use(express.static('./assets'));
app.use(expressLayouts);
// extract style and script form sub pages to layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// this is for routes, it will automatically fetches the index.js in routes folder
app.use('/', require('./routes'));

// setup view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err)
{
    if(err)
    {
        console.log(`error in listening to port : ${err}`);
        return;
    }

    console.log(`express is running on port : ${port}`);
});