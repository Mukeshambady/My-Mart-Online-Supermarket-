console.log('hello');
console.log('-------------------');

LOGIN_DOC = {
  username: '',
  password: '',
  createdBy: '',
  state: '', //0 admin, 1 suser, 2 dealer 
  status: 1,
  date: new Date()
}
// LOGIN_DOC = {
//   username: 'user',
//   password: '123',
//   createdBy: 'me',
//   state: 2, //0 admin, 1 suser, 2 dealer 
//   status: 1,
//  da
// }
LOGIN_DOC.state=2
console.log(LOGIN_DOC);