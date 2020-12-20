const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,   
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
    },
    profile: {
        firstName: {
            type: String,
            maxlength: 64
        },
        lastName: {
            type: String,
            maxlength: 64
        },
        picture: {
            type: String
        },
        gender:{
            type :String,
            default : 'Male'
        },
        telephone : {
            type: String
        },
        address: {
            type: String
        }
    },
    role: {
        type: String,
        'default': 'agent'
    },
    notificationToken: {
        type: String,
        default: ""
    },
    activationToken: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    note:{
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
    try {
        //the user schema is instantiated
        const user = this;
        //check if the user has been modified to know if the password has already been hashed
        if (!user.isModified('password')) {
          next();
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(12);
        // Generate a password hash (salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt);
        // Re-assign hashed version over original, plain text password
        this.password = passwordHash;
        next();
      } catch (error) {
        next(error);
      }
});

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
}


//create Model
const User = mongoose.model('user', userSchema);

//Export the Model
module.exports = User;