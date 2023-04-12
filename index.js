const express= require('express');
const cookieParser = require('cookie-parser');
const port = 8000;
const app= express();
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookies 
const session= require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const MongoDBStore=require('connect-mongodb-session')(session);

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

// setup view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store session cookies in db
const store = new MongoDBStore(
    {
        // database name its only taking url 
        uri: 'mongodb://localhost/codeial_development',
        collection: 'mySession'
    },
    function(err)
    {
        console.log(err || 'connect-mongodb-session setup ok');
    }
); 

// setup session cookie
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode 
    secret:'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie:
    {
        maxAge:(100 * 60 * 100) //it will calculate in milisecond
    },
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

// this is for routes, it will automatically fetches the index.js in routes folder
app.use('/', require('./routes'));

app.listen(port, function(err)
{
    if(err)
    {
        console.log(`error in listening to port : ${err}`);
        return;
    }

    console.log(`express is running on port : ${port}`);
});