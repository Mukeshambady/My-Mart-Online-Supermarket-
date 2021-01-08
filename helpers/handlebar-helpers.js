const productHelper=  require('../helpers/product-helper')


module.exports={
    numbering: (value) => {
        return value + 1
      },

      eqIf: (str1,str2) => {
        return (str1==str2)?true:false   
      },
      ifUrl: (str) => {
        return(str)?str:'/'
      },

     step1: function( value ){
       if(value==1 ||value==2||value==3||value==4||value==5||value==7){
        return 'active'
       }
    },
     step2: function( value ){
       if(value==2||value==4||value==5||value==7){
        return 'active'
       }else{
         return 'text-muted'
       }
    },
     step3: function( value ){
       if(value==7){
        return 'active'
       }else{
         return 'text-muted'
       }
    },




      // cartCount1: ()=>{
      //   return new Promise(async(resolve,reject)=>{
      //     await productHelper.getCartCount('5fce179a96c85b19e4ec6c1b').then((count)=>{
      //       console.log('count-----------', count);

      //       resolve( count)
      //     })
          
      //   }) 
      //   // let count= productHelper.getCartCount('5fce179a96c85b19e4ec6c1b')
      //   // console.log('count', count);
      //   // return {count:count}
      // },

      // placed: 1,
      // confirmed: 2,
      // pending: 3,
      // delayed: 4,
      // outOfDelivery: 5,
      // rejected: 6,
      // delivered: 7

     

}