
const jwt = require('jsonwebtoken');

const model =require('../models/user.model');

const userControllers ={};

// Register Hand

userControllers.register = async (req,res,next ) =>
 {

    const { name, phone, email, password }=req.body;

   const newmodel = new model
   ({
        name,
        phone,
        email,
        password
   })

   //  email handel
   try
    {
       const user = await newmodel.save();
       return res.send({user});
   }
   catch(er)
   {
    if (er.code === 11000 && er.name === 'MongoError')
    {
    const error = new Error(`Email address  ${newmodel.email} is already taken `);
    error.status = 400
    next(error);
    }

    else
    {
        next({message:'there is an error , please check your information again'});
    }
   }

};


// Login handel
userControllers.login = async (req, res, next) =>
 {
    // email  , password in request
    const { email, password } = req.body;


    try
    {
        //Retrieve user information
        const user = await model.findOne({ email });

        if (!user )
            {
                const err = new Error(` email  ${email} does not exist`);
                 err.status = 401;
                 next(err)
            }

        // Check the password
        user.isPasswordMatch(password, user.password, ( _err, success) =>
         {
            if (success)
             {
                  // Generate JWT
                const secret = process.env.JWT_SECRET;
                const expire = process.env.JWT_EXPRIATION;

                const token = jwt.sign({ _id: user._id }, secret, { expiresIn: expire });

                 return res.send({token });
             }

            res.status(401).send({

                error: 'Invalid password'
            });
        });

    }catch(e)
    {
        next(e);
    }

};

   /*   else
            {
                const message = {message:` Welcome ${user.name} `};
                 return res.send(message)
            }
        */

module.exports = userControllers ;