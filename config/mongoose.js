const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development');

const db=mongoose.connection;

db.on('error', console.log.bind(console, 'Error in connecting to mongoDB'));

db.once('open', function()
{
    console.log("Successfully connected to database");
});

module.exports = db;