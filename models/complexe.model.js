const mongoose = require('mongoose');


const complexeSchema = mongoose.Schema({
    name: {
        type: String
    },
    address:{
        type: String
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    numero:{
        type: String
    },
    opening: {
        type: String
    },
    closing: {
        type: String
    }
});

const Complexe = mongoose.model('complexe', complexeSchema);

module.exports = Complexe;