const mongoose=require('mongoose');
const env=require('./enviorment');
mongoose.connect(`mongodb://localhost/${env.db}`);

const db=mongoose.connection;

db.on('error', console.log.bind(console, 'Error in connecting to mongoDB'));

db.once('open', function()
{
    console.log("Successfully connected to database");
});

module.exports = db;