const productHelper=  require('../helpers/product-helper')


module.exports={
    numbering: (value) => {
        return value + 1
      },

      eqIf: (str1,str2) => {
        return(str1===str2)?true:false
      },
      ifUrl: (str) => {
        return(str)?str:'/'
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

}