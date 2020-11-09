const routerUser = require('express').Router();
const { validateCreateUser, loginUser, getUser, updateUser, deleteUser } = require('./users')
const { validateToken } = require('../securityComponent/security')



routerUser.post('/createUser', validateCreateUser);
routerUser.post('/loginUser', loginUser);
routerUser.get('/getUser', validateToken, getUser);
routerUser.put('/updateUser', validateToken, updateUser);
routerUser.delete('/deleteUser', validateToken, deleteUser);

module.exports = routerUser;