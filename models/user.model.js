const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const Positions = Object.freeze({
    Gardien: 'Gardien',
    DefenseurCentral: 'Défenseur Central',
    DefenseurGauche: 'Défenseur Gauche',
    DefenseurLateralGauche: 'Défenseur Latéral Gauche',
    DefenseurDroit: 'Défenseur Droit',
    DefenseurLateralDroit :'Défenseur Latéral Droit',
    MilieuDefensifCentral :'Milieu Défensif Central',
    MilieuCentre:'Milieu centre',
    MilieuOffensifCentral:'Milieu offensif central',
    MilieuGauche:'Milieu gauche',
    AilierGauche:'Ailier gauche', 
    MilieuDroit :'Milieu droit',
    AilierDroit :'Ailier droit',
    Attaquant :'Attaquant',
    AvantCentreGauche :'Avant Centre gauche',
    AvantCentreDroit: 'Avant Ccentre droit' 
  });
  const Roles = Object.freeze({
    Proprietaire: 'proprietaire',
    Coach: 'coach',
    Joueur: 'joueur',
  });
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
        fullName: {
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
        },
        dateOfBirth:{
            type: Date
        },
        height:{
            type: Number
        },
        weight:{
            type:Number
        },
        preferedFoot:{
            type: String
        },
        position: {
            label:{
                type: String,
                enum: Object.values(Positions),
    
            },
            abbreviation:{
                type: String
            }
    
        },
        description :{
            type: String
        },
        rating: {
            type: Number,
        },
        attributeDetails:{
            pace:{
                value:{
                    type:Number
                },
                acceleration:{ type:Number},
                sprintSpeed:{ type:Number}
            },
            shooting:{
                value:{
                    type:Number
                },
                attPosition:{type:Number},
                finishing:{type:Number},
                shotPower:{type:Number},
                longShots:{type:Number},
                volleys:{type:Number},
                penalties:{type:Number}
            },
            passing:{
                value:{
                    type:Number
                },
                vision:{type:Number},
                crossing:{type:Number},
                fkAcc:{type:Number},
                shortPass:{type:Number},
                longPass:{type:Number},
                curve:{type:Number}
            },
            dribbling:{
                value:{
                    type:Number
                },
                agility:{type:Number},
                balance:{type:Number},
                reactions:{type:Number},
                ballControl:{type:Number},
                dribbling:{type:Number},
                composure:{type:Number}
            },
            defending:{
                value:{
                    type:Number
                },
                interceptions:{type:Number},
                headingAcc:{type:Number},
                defAware:{type:Number},
                standTackle:{type:Number},
                slideTackle:{type:Number}
            },
            physical:{
                value:{
                    type:Number
                },
                jumping:{type:Number},
                stamina:{type:Number},
                strength:{type:Number},
                aggression:{type:Number}
            }
        },
        kitNumber:{
            type:Number
        },
        rating:{
            type: Number
        }
    },
    role: {
        type: String,
        'default': 'proprietaire',
        enum: Object.values(Roles),
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
Object.assign(userSchema.statics, {
    Roles,
  });

//create Model
const User = mongoose.model('user', userSchema);

//Export the Model
module.exports = User;