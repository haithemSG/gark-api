const mongoose = require('mongoose');


const groupSchema = mongoose.Schema({
    name: {
        type: String
    },
    entraineur: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    joueurs: [{
        type: mongoose.Types.ObjectId,
        ref: 'user'
    }],
    
}, {
    timestamps: true
});

const Group = mongoose.model('group', groupSchema);
module.exports = Group;