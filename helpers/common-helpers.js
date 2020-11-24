var db = require('../config/connection')
var COLLECTION_DATA = require('../config/string_collections')
const bcrypt = require('bcrypt')
//object id declaration to compare(string converted to object)
var object =require('mongodb').ObjectID


module.exports={
    doSignup: (userData) => {
       
//         COLLECTION_DATA.LOGIN_DOC={username:"admin",password:"1234",state:COLLECTION_DATA.LOGIN_STATES.admin}
//         userData= COLLECTION_DATA.LOGIN_DOC
//  console.log('----------------------'+ userData);
    
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password,10 )
            db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            })
        })
    },
}