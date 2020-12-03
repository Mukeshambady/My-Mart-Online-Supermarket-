module.exports.TABLE_COLLECTIONs = {
    login: 'login',
    dealer:'dealer'
},

    module.exports.LOGIN_DOC = {
        username: '',
        password: '',
        createdBy: '',
        state: '', //0 admin, 1 suser, 2 dealer 
        status: 1,
        date: new Date()
    },

    module.exports.LOGIN_STATES = {
        admin: 0,
        user: 1,
        dealer: 2
    }


module.exports.DEALER_DOC = {
    _id: "",
    storeName: '',
    name:'',
    email: '',
    phoneNumber: 0,
    address: '',
    extraInFormation: '',
    profilePicture: '',
    date: new Date()
}