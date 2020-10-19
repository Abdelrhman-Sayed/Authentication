const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const {Schema}= mongoose ;

const userschema =Schema(
    {
      name: {
        type: String,
        trim: true,
        required: true
      },
      phone: {
        type: String,
        required: true
      },

      email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true
      },

      password: {
        type: String,
        required: true
      },



      role: {
        type: String,
        default: 'follow'
      },
    },


);

userschema.pre('save', async function(next)
 {
    // Check if password is not modified
    if (!this.isModified('password'))
    {
      return next();
    }

    //Encrypt the password
  try
    {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    }
   catch (er)
    {
    return next(er);
    }
});

// check is password mathch //
userschema.methods.isPasswordMatch = function(password, hashed, callback)
{
  bcrypt.compare(password, hashed, (_err, success) =>
   {
    if (_err)
    {
      return callback(_err);
    }
    callback(null, success);
  });
};

// hide password //
userschema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const model = mongoose.model('model',userschema);
module.exports=model;