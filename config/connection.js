const mongoClient = require('mongodb').MongoClient
const state ={
    db:null
}
   
module.exports.connect = async function(done){
    const url =await "mongodb+srv://mukesh:9km7BWUYUXRquSFD@mymart.au7ts.mongodb.net/mymart?retryWrites=true&w=majority" //"mongodb://localhost:27017"
    //const url ="mongodb://localhost:27017"
    const dbname= "mymart"
    mongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,data)=>{
        // console.log('data---',data);
        if(err){
            console.log(err);
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