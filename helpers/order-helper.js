
const commonHelpers = require("./common-helpers");
const string_collections = require('../config/string-collections');

//object id declaration to compare(string converted to object)
var objectId = require('mongodb').ObjectID;
const { resolve, reject } = require("promise");
const { response } = require("express");



let cartCollectionName = string_collections.TABLE_COLLECTIONs.cart;
let cartDoc = string_collections.CART_DOC

let orderCollectionName = string_collections.TABLE_COLLECTIONs.order;
let orderDoc = string_collections.ORDER_DOC

module.exports = {

   
    //Cart history
    getOrderDetails:function(dealerId){
        return new Promise(async (resolve,reject)=>{
            let result = await commonHelpers.getOrderHistory(orderCollectionName, { dealerId: objectId(dealerId) })            
            resolve(result);
        }).catch((err) => {
            console.log('certHistory error ', err)
        })
    },
    //getOrderDetailsByUser
    getOrderDetailsByUser:function(userId){
        return new Promise(async (resolve,reject)=>{
            let result = await commonHelpers.getOrderHistory(orderCollectionName, { userId: objectId(userId) })            
            resolve(result);
        }).catch((err) => {
            console.log('certHistory error ', err)
        })
    },
    //getOrderDetailsByOrderId
    getOrderDetailsByOrderId:function(id){
        return new Promise(async (resolve,reject)=>{
            let result = await commonHelpers.getOrderHistory(orderCollectionName, { _id: objectId(id) })            
            resolve(result);
        }).catch((err) => {
            console.log('certHistory error ', err)
        })
    },
    
    //getOrder Product Details history based on order id, user id and dealer id
    getOrderProductDetails:function(searchIds){
        return new Promise(async (resolve,reject)=>{
            let result = await commonHelpers.getOrderHistory(orderCollectionName, { 
                _id: objectId(searchIds.orderId)
               
            })
            let data=''
           
            for(i in result[0].products){
                data+=' <tr >'+
                '<td  class="align-middl p-1 m-1">'+(parseInt( i) + 1)+'</td>'+
                '<td  class="align-middl p-1 m-1"><img'+
                       ' src="../products-pic/' + result[0].products[i].productImage + '"'+
                        'height="50px" width="50px" alt="product cart Image"'+
                       ' srcset=""></td>'+
                '<td  class="align-middl p-1 m-1">' + result[0].products[i].name + 
               ' <span class="text-mute">(' + result[0].products[i].weight +result[0].products[i].measure +')</span>'+
                '</td>'+      
               ' <td  class="align-middl p-1 m-1">'+ result[0].products[i].quantity+'</td>'+
               ' <td  class="align-middl p-1 m-1">X</td>'+
                '<td  class="align-middl p-1 m-1">' + result[0].products[i].price+'</td>'+
                '<td  class="align-middl p-1 m-1">' + result[0].products[i].total+'</td>'+

           ' </tr>'
            }
            user=result[0].name+'<br>'+result[0].address
            output={
                data:data,
                grandTotal:result[0].totalPrice,
                totalQuantity:result[0].totalQuantity,
                user:user
            }
            resolve(output);
        }).catch((err) => {
            console.log('getOrderProductDetails error ', err)
        })
    },

    //order stste changing
    setOrderState:function(orderId,state){
        orderDoc={_id:{_id:objectId(orderId)},status:state}
        return new Promise((resolve,reject)=>{
            commonHelpers.doUpdateOne(orderCollectionName,orderDoc).then((value)=>{
                resolve(value)
            })
           
        })
    },
   
    


    //end export
}





