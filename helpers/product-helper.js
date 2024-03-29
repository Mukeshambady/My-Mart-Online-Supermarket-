
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID;
const { resolve, reject } = require("promise");



let productCollectionName = string_collections.TABLE_COLLECTIONs.product;
let productDoc = string_collections.PRODUCT_DOC

let cartCollectionName = string_collections.TABLE_COLLECTIONs.cart;
let cartDoc = string_collections.CART_DOC

let orderCollectionName = string_collections.TABLE_COLLECTIONs.order;
let orderDoc = string_collections.ORDER_DOC

module.exports = {

    //update updateDealerProduct
    
  
updateDealerProduct: (id, data) => {
    return new Promise(async (resolve, reject) => {

        const userId = objectId(id).toString()
        productDocDoc = {
            _id: { _id: objectId(userId) },
            name: data.name,
            category: data.category,
            price: parseInt( data.price),
            weight: parseInt( data.weight),
            measure: data.measure,
           
            productInfo: data.productInfo
        }
        let  stock= ( data.stock)? parseInt( data.stock):parseInt(0)
        if(data.image){
            productDocDoc.productImage = data.image
        }//doUpdateOneAndIncrementProduct
        
        await commonHelpers.doUpdateOneAndIncrementProduct(productCollectionName, productDocDoc,stock).then((product) => {
            resolve(product)
        }).catch((err) => {
            console.log('updateDealerProduct Fail', err);
        })
    })
},


    //AdddealerProduct by dealer _id
    AddDealerProduct: function (userId, productDeatils) {
        user_Id = objectId(userId.trim())
        pro_name = productDeatils.name.trim()
        productDoc.name = pro_name
        productDoc.category = productDeatils.category.trim()
        productDoc.stock = parseInt( productDeatils.stock.trim())
        productDoc.price = parseInt( productDeatils.price.trim())
        productDoc.weight =parseInt( productDeatils.weight.trim())
        productDoc.measure =  productDeatils.measure.trim()
        productDoc.productInfo = productDeatils.productInfo.trim()
        productDoc.dealer_id = user_Id

        if(productDeatils.image){
            productDoc.productImage = productDeatils.image
        }else{
            productDoc.productImage ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfO2uBQZ2-m7MkBvge4dwsLxEt6hztJtg1kA&usqp=CAU"
        }
       

        delete productDoc._id
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doInsertOne(productCollectionName, productDoc).then((product) => {
                if (product)
                    result = product.productImage
                resolve(result)
            }).catch((err) => {
                console.log('AdddealerProduct Fail', err);
            })
        })
    },
    //find dealerProducts by _id
    dealerProducts: function (userId) {

        productDoc = { dealer_id: objectId(userId), status: 1 }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFind(productCollectionName, productDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
    //find dealerProducts by _id
    getDealerProductOne: function (userId) {

        product_id = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.getFindOnewithId(productCollectionName, product_id).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },

    //Ajax
    //productDelete  by _id bot login and dealer
    productDelete: function (userId) {
        productDoc = { _id: objectId(userId) }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doFindOneAndDelete(productCollectionName, productDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('productDelete error ', err)
                reject()
            })
        })
    },

    //productBanOrUnban by _id
    productBanOrUnban: function (userId, status) {
        productDoc = { _id: { _id: objectId(userId) }, status: status }
        return new Promise(async (resolve, reject) => {
            await commonHelpers.doUpdateOne(productCollectionName, productDoc).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('productBanOrUnban error ', err)
                reject()
            })
        })
    },

    //All Product---BAN--Lists
    productAllBanDetail: function (dealerid) {
        return new Promise(async (resolve, reject) => {
            // getFindAllDetails: (docName, status,state)
            productSearch = { dealer_id: objectId(dealerid), status: 0 }
            await commonHelpers.getFind(productCollectionName, productSearch).then((data) => {
                resolve(data)
            }).catch((err) => {
                console.log('Dealer Details Fetch error ', err)
                reject()
            })
        })
    },
   
    //searchProduct
    searchProduct:function(searchItem){
        return new Promise(async (resolve,reject)=>{
            data=''
           await commonHelpers.searchItems(searchItem).then((result)=>{
            for (i in result) {
                console.log(result[i].name);
                data +='<div class="row row-cols-1 row-cols-md-3 ">'               
                        +'<div class="col mb-4">'
                            +'<div class="card">'
                
                            +'<div class="view overlay">'
                
                            +'<img class="card-img-top" src="'+result[i].profilePicture+'" height="250px" alt="Card image cap">'
                           +' <a href="">'
                               +' <div class="mask rgba-white-slight"></div>'
                           +' </a>'
                           +' </div>'                       
                            +'<div class="card-body">'
                            +'<h4 class="card-title">'+result[i].storeName+'</h4>'
                            
                            +'<p class="card-text">'+result[i].extraInFormation+'</p>'
                
                            +'<a href="'+result[i]._id+'" class="btn btn-light-blue btn-md">See More</a>'
                
                            +'</div>'
                
                        +'</div>'
                        
                        +'</div>'
                    
                
                    +'</div>'
            }
           })
            resolve(data)
        })
    }


    //end export
}





