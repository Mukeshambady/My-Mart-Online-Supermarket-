module.exports.TABLE_COLLECTIONs = {
    login: 'login',
    dealer: 'dealer',
    product: 'product',
    user: 'user',
    cart: 'cart',
    order: 'order'
}

module.exports.LOGIN_DOC = {
    username: '',
    password: '',
    createdBy: '',
    state: '', //0 admin, 1 suser, 2 dealer 
    status: 1,
    date: new Date()
}

module.exports.LOGIN_STATES = {
    admin: 0,
    user: 1,
    dealer: 2
}
module.exports.ODERING_STATE = {
    placed: 1,
    confirmed: 2,
    pending: 3,
    delayed: 4,
    outOfDelivery: 5,
    rejected: 6,
    delivered: 7
}

module.exports.DEALER_DOC = {
    _id: "",
    storeName: '',
    name: '',
    email: '',
    phoneNumber: 0,
    address: '',
    extraInFormation: '',
    profilePicture: '',
    date: new Date()
}
module.exports.PRODUCT_DOC = {
    name: '',
    category: '',
    stock: '',
    price: '',
    weight: '',
    measure: '',
    dealer_id: '',
    productImage: '',
    productInfo: '',
    date: new Date(),
    status: 1
}

module.exports.USER_DOC = {
    _id: '',
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
    profilePicture: '',
    date: new Date()
}

module.exports.CART_DOC = {
    userId: '',
    dealerId: '',
    products: { productId: '', quantity: 0 }
}
module.exports.ORDER_DOC = {
    _id: '',
    deliveryDetails: '',
    userId: '',
    paymentMethord: '',
    products: '',
    totalPrice: '',
    status: '',
    date: new Date()
}