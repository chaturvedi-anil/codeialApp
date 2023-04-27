const path = require('path');
const env=require('./enviorment');
const fs=require('fs');

module.exports = (app)=>
{
    app.locals.assetPath = function(filePath)
    {
        if(env.name = 'development')
        {
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, ('../public/asstes/rev-manifest.json'))))[filePath];
    }
}