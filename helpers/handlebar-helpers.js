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

    //  select: function( value, options ){
    //     var $el = $('<select />').html( options.fn(this) );
    //     $el.find('[value="' + value + '"]').attr({'selected':'selected'});
    //     return $el.html();
    // },




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