// ----   doc Auth route  ----//

const express = require('express');
const bodyparser = require('body-parser');
const router = express.Router();

var jsonParser = bodyparser.json()
const userControllers = require('../controllers/user.controle');
var urlencodedParser = bodyparser.urlencoded({ extended: false })

// Register route

router.get('/',function(req, res){
    res.render('signup.html');
});

router.post('/',urlencodedParser, userControllers.register ,function(req, res){
    console.log(req.body);
    res.render('signin.html',{qs:req.body});
});




module.exports = userControllers;
module.exports = router;