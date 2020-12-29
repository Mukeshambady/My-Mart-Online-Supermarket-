
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID;
const { resolve, reject } = require("promise");



let cartCollectionName = string_collections.TABLE_COLLECTIONs.cart;
let cartDoc = string_collections.CART_DOC

let orderCollectionName = string_collections.TABLE_COLLECTIONs.order;
let orderDoc = string_collections.ORDER_DOC
let orderState= string_collections.ODERING_STATE
module.exports = {

    // cart details
    setCart: (data) => {
        cartDoc = {}
        cartDoc = {
            userId: objectId(data.userId),
            dealerId: objectId(data.dealerId),
            products: [{
                product_id: objectId(data.productId),
                quantity: parseInt(data.qty)
            }]
        }
        let products = {}
        products = {
            product_id: objectId(data.productId),
            quantity: parseInt(data.qty)
        }
        return new Promise(async (resolve, reject) => {
            let userCart = await commonHelpers.getFindOneWithId(cartCollectionName, { userId: cartDoc.userId, dealerId: cartDoc.dealerId })

            if (userCart) {

                let proExist = userCart.products.findIndex(product => product.product_id == data.productId)
                if (proExist != -1) {
                    commonHelpers.doUpdateOneAndIncrement(cartCollectionName, cartDoc.userId, products.product_id, products.quantity)
                    resolve(true)
                } else {
                    commonHelpers.doUpdateOnePush(cartCollectionName, { userId: cartDoc.userId }, products)
                    resolve(true)
                }

            } else {
                await commonHelpers.doInsertOne(cartCollectionName, cartDoc).then((result) => {
                    resolve(true)
                }).catch((err) => {
                    console.log('SetCart Error : ', err);
                })
            }


        })
    },

    //Ajax
    //Check Out Oder 
    checkOut: (userId) => {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOneWithId(cartCollectionName, { userId: objectId(userId) }).then(async (cart) => {
                let totals = await commonHelpers.getTotalAmount({ userId: objectId(userId) })
                orderDoc = cart
                orderDoc.paymentMethord = 'COD'
                orderDoc.totalPrice = totals.total
                orderDoc.status = orderState.placed
                orderDoc.date = new Date()
                return orderDoc
            }).then(async (result) => {
               return await commonHelpers.doInsertOne(orderCollectionName, result)

            }).then(async(data) => {
               
                await commonHelpers.doFindOneAndDelete(cartCollectionName,{_id:objectId(data._id)}).then((result)=>{
                    resolve(result.ok)
                })
            }).catch((err) => {
                console.log('checkOut', err);
            })

        })
    },
    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0
            await commonHelpers.getFindOneWithId(cartCollectionName, { userId: objectId(userId) }).then((cart) => {
                if (cart) {
                    count = cart.products.length
                }
                resolve(count)
            }).catch((err) => {
                console.log('getCartCount', err);
            })

        })
    },
    //increment and decrement quantity
    setCartQuantity: (data) => {

        return new Promise(async (resolve, reject) => {
            await commonHelpers.doUpdateOneAndIncrement(cartCollectionName, objectId(data.userId), objectId(data.productId), data.quantity)
            resolve(true)
        })

    },

    //get getCartProducts
    getCartProducts: function (userId) {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOneWithId(cartCollectionName, { userId: objectId(userId) }).then((result) => {
                resolve(result)
            })
        }).catch((err) => {
            console.log('getCartProducts error ', err)
        })
    },
    //get Grand Total and total quantity
    getTotalAmount: function (userId) {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getTotalAmount({ userId: objectId(userId) }).then((result) => {
                resolve(result)
            })
        }).catch((err) => {
            console.log('getTotalAmount error ', err)
        })
    },

    //remove Cart Product only
    removeCartProduct: function (data) {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.removeCartProduct(objectId(data.userId), objectId(data.productId)).then((result) => {
                resolve(result)
            })
        }).catch((err) => {
            console.log('removeCartProduct error ', err)
        })
    },
    //Delet Cart 
    deleteCart: function (userId) {
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doFindOneAndDelete(cartCollectionName, { userId: objectId(userId) }).then((result) => {
                resolve(result)
            })
        }).catch((err) => {
            console.log('deleteCart error ', err)
        })
    },

    //Cart history
    getCartHistory:function(userId){
        return new Promise(async (resolve,reject)=>{
            let result = await commonHelpers.getOrderHistory(orderCollectionName, { userId: objectId(userId) })
            resolve(result);
        }).catch((err) => {
            console.log('certHistory error ', err)
        })
    }
    


    //end export
}





