const express= require('express');
// enviorment variables
const env= require('./config/enviorment');
// for storing the log 
const logger=require('morgan');
const cookieParser = require('cookie-parser');
const port = 8000;
const app= express();
// for accessing helper function
require('./config/view-helpers')(app);
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//used for session cookies 
const session= require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoDBStore=require('connect-mongodb-session')(session);
const sassMiddleware =require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io

const chatServer = require('http').Server(app);
const chatSocket = require('./config/chat_sockets').chatSocket(chatServer);
chatServer.listen(5000);
console.log('chat server is listing on port 5000');
const path = require('path');
// sass middleware
if(env.name == 'development')
{
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: false,
        outputStyle: 'extended',
        prefix: '/css'
    }));
} 

// setting body parser middileware
app.use(express.urlencoded());

// setting cookies parser
app.use(cookieParser());

// statics files
app.use(express.static(env.asset_path));

// make the upload path avilable to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// for logger
app.use(logger(env.morgan.mode, env.morgan.options));

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
    secret: env.session_cookie_key,
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

// flash messages
app.use(flash());
//response for flash
app.use(customMware.setFlash);

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