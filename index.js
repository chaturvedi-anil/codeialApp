const express= require('express');
const port = 8000;
const app= express();
const expressLayouts = require('express-ejs-layouts');

app.use(expressLayouts);

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