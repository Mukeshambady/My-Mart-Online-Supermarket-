var db = require('../config/connection')
var COLLECTION_DATA = require('../config/string-collections')
const bcrypt = require('bcrypt')





module.exports = {
    doSignup: (userData) => {
        // delete userData._id //remove the _id field
        return new Promise(async (resolve, reject) => {

            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            }).catch((err) => {

                reject(false)
                console.log('doSignup Error', err);

            })
        })
    },
    //Login 
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log('login Success');
                        delete user.password
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("Fail to login");
                        resolve({ status: false })
                    }
                })


            } else {
                console.log("Email Fail to login");
                resolve({ status: false })
            }
        })
    },
    //check username 
    doUsernameCheck: (userData) => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(COLLECTION_DATA.TABLE_COLLECTIONs.login).findOne({ username: userData })
            if (user) {
                resolve({ status: true })
            } else {
                resolve({ status: false })
            }
        }).catch((err) => {
            console.log('doUsernameCheck Error', err);
        })
    },
    //get find One With Id 
    getFindOnewithId: (collectionName,documentId) => {
        return new Promise(async (resolve, reject) => {
            let CollectionDetails = await db.get().collection(collectionName).findOne(documentId)
            if (CollectionDetails) {
                resolve(CollectionDetails )
            } else {
                resolve({ status: false })
            }
        }).catch((err) => {
            console.log('getFindOnewithId Error', err);
        })
    },

    //Insert Once 
    doInsertOne: (docName, colData) => {
       
        return new Promise(async (resolve, reject) => {
            await db.get().collection(docName).insertOne(colData).then((data) => {
                resolve(data.ops[0])
            }).catch((err) => {
                console.log('doInsertOne Error', err);
            })
        })
    },

    //Find All
    //using promise functionality
    getFind: (docName,arg={}) => {
        console.log('arg',arg);
        return new Promise(async (resolve, reject) => {
            let docDetails = await db.get().collection(docName).find(arg).toArray()
            resolve(docDetails)
        }).catch((err) => {
            console.log('getFind Error', err);
        })
    },

    //Find All
    //using promise functionality
    getFindWithId: (docName, id) => {
        return new Promise(async (resolve, reject) => {
            let docDetails = await db.get().collection(docName).find(id).toArray()
            resolve(docDetails)
        }).catch((err) => {
            console.log('getFind Error', err);
        })
    },



    //Find One
    //using promise functionality
    getFindOne: (docName, id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection('login').aggregate([
                {
                    $match: { _id: id._id }
                },
                {
                    $project: { username: 1 }
                },
                {
                    $lookup: {
                        from: docName, localField: '_id', foreignField: '_id', as: "dealerDetails"
                    }
                },
                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$dealerDetails", 0] }, "$$ROOT"] } }
                },
                {
                    $project: { dealerDetails: 0 }
                },
            ]).toArray().then((docDetails) => {
                resolve(docDetails[0])
            })

        }).catch((err) => {
            console.log('getFindOne Error', err);

        })
    },
    //Find all Data by active status
    //using promise functionality
    getFindAllDetails: (docName, status, state) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection('login').aggregate([
                {
                    $match: { "status": status, "state": state }
                },
                {
                    $lookup: {
                        from: docName, localField: '_id', foreignField: '_id', as: "dealerDetails"
                    }
                },

                {
                    $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$dealerDetails", 0] }, "$$ROOT"] } }
                },
                {
                    $project: { dealerDetails: 0, password: 0, createdBy: 0 }
                }

            ]).toArray().then((docDetails) => {
              
                resolve(docDetails)
            })

        }).catch((err) => {
            console.log('getFindOne Error', err);
        })
    },
    //Insert Once 
    doUpdateOne: (docName, colData) => {

        var id = colData._id
        delete colData._id

        return new Promise(async (resolve, reject) => {
            await db.get().collection(docName).updateOne(id, { $set: colData },{ upsert: true }).then((result) => {

                if (result.matchedCount == 1) {
                    resolve(result)
                }
            }).catch((err) => {
                console.log('doUpdate-Error', err);
                reject(false)
            })
        })
    },

    //do   find one and delete
    doFindOneAndDelete: (colName, docData) => {

        return new Promise((resolve, reject) => {
            db.get().collection(colName).findOneAndDelete(docData).then((result) => {
                resolve(result)
            }).catch((err) => {
                console.log('doFindOneAndDelete-Error ', err);
                reject(false)
            })
        })
    }


}