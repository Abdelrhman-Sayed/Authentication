// ----   doc Auth route  ----//
const express = require('express');
const passport = require ('passport');
const bodyparser = require('body-parser');
const router = express.Router();

const userControllers =require('../controllers/user.controle');
var jsonParser = bodyparser.json()
var urlencodedParser = bodyparser.urlencoded({ extended: false })

// the login page

router.get('/', function(req, res){
    res.render('signin.html');
});

router.post('/',urlencodedParser,userControllers.login, function(req, res){
    res.render('signin.html');
});



// Customize auth message Protect the  routes
router.all('*', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            const error = new Error('You are not authorized to access this area');
            error.status = 401;
            throw error;
        }

        req.user = user;
        return next();
    })(req, res, next);

});

module.exports = userControllers ;
module.exports=router;