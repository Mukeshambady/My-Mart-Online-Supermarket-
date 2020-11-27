




module.exports.TABLE_COLLECTIONs = {
    login: 'login',
    dealer:'dealer'
},

    module.exports.LOGIN_DOC = {
        username: 'username',
        password: 'password',
        createdBy: 'createdby',
        state: 'state', //0 admin, 1 suser, 2 dealer 
        status: 'status',
        date: 'date'
    },

    module.exports.LOGIN_STATES = {
        admin: 0,
        user: 1,
        dealer: 2
    }

module.exports.DEALER_DOC = {
    id: "_id",
    storeName: 'storename',
    email: 'email',
    phoneNumber: 'phone',
    address: 'address',
    extraInFormation: 'extrainfo',
    profilePicture: 'picture',
    date: 'date'
}