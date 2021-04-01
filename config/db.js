const connectionDB = require('../database/connection')

if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: connectionDB()}
}
else{
    module.exports = {mongoURI: 'DB local'}
}