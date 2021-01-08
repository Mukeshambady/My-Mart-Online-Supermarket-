const mongoClient = require('mongodb').MongoClient
const state ={
    db:null
}
//mongodb+srv://mukesh:<password>@cluster0.au7ts.mongodb.net/<dbname>?retryWrites=true&w=majority
module.exports.connect = function(done){
    const url ='mongodb+srv://mukesh:mukesh654654@cluster0.au7ts.mongodb.net/mymart?retryWrites=true&w=majority'  //"mongodb://localhost:27017"
    const dbname= "mymart"
    mongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,data)=>{
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