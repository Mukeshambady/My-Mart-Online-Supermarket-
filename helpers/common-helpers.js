var db = require('../config/connection')
var COLLECTION_DATA = require('../config/string-collections')
const bcrypt = require('bcrypt')
const { resolve, reject } = require('promise')





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
    getFindOnewithId: (collectionName, documentId) => {
        return new Promise(async (resolve, reject) => {
            let CollectionDetails = await db.get().collection(collectionName).findOne(documentId)
            if (CollectionDetails) {
                resolve(CollectionDetails)
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
    getFind: (docName, arg = {}) => {
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
    //Find All
    //using promise functionality
    getFindOneWithId: (docName, id) => {
        return new Promise(async (resolve, reject) => {
            let docDetails = await db.get().collection(docName).findOne(id)
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
    getFindAllDetails: (docName, matchItems) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection('login').aggregate([
                {
                    $match: matchItems
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
    //doUpdateOne
    doUpdateOne: (docName, colData) => {

        var id = colData._id
        delete colData._id

        return new Promise(async (resolve, reject) => {
            await db.get().collection(docName).updateOne(id, { $set: colData }, { upsert: true }).then((result) => {

                if (result.matchedCount == 1) {
                    resolve(result)
                }
            }).catch((err) => {
                console.log('doUpdate-Error', err);
                reject(false)
            })
        })
    },
    //doUpdateOneWithId with specific ID  
    doUpdateOnePush: (docName,id, colData) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(docName).updateOne(id, { $push: {products:colData} }, { upsert: true }).then((result) => {

                if (result.matchedCount == 1) {
                    resolve(result)
                }
            }).catch((err) => {
                console.log('doUpdate-Error', err);
                reject(false)
            })
        })
    },
    //doUpdateOneAndIncrement 
    doUpdateOneAndIncrement: (docName, userId, productId, increment) => {
        return new Promise((resolve, reject) => {
            db.get().collection(docName)
                .updateOne({ userId: userId, 'products.product_id': productId }, {
                    $inc: { 'products.$.quantity': parseInt(increment) }
                }).then((response) => {
                    resolve()
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
    },
//get cart prodect depends up on a user
 //select prodect from cart 
 getCartProducts: (collection,userId) => {

    return new Promise(async (resolve, reject) => {
        let cartItems = await db.get().collection(collection).aggregate([
            {
                $match:  userId 
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.product_id',
                    quantity: '$products.quantity'
                }
            },
            {
                $lookup: {
                    from: COLLECTION_DATA.TABLE_COLLECTIONs.product,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    _id:0,cart_id:'$_id', quantity: 1, product: 1
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$product", 0] }, "$$ROOT"] } }
            },
            {
                $project: {
                     product: 0
                }
            },

        ]).toArray()
        // console.log('cartItems-----------',cartItems);
        resolve(cartItems)
    })
},



}