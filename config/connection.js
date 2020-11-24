const mongoClient = require('mongodb').MongoClient
const state ={
    db:null
}

module.exports.connect = function(done){
    const url ="mongodb://localhost:27017"
    const dbname= "mymart"
    mongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,data)=>{
        if(err){
            return done(err)
        }else{
            state.db = data.db(dbname)
            done()
        }
    })
}

module.exports.get= function(){
    return state.db
}