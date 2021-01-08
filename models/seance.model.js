const mongoose = require('mongoose');


const seanceSchema = mongoose.Schema({
    titre: {
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
    address: {
        type: String
    },
    date: {
        type: Date
    },
    duration: {
        type: Number
    },
    geoloacation: {
        lang: {
            type: Number
        },
        lat: {
            type: Number
        }
    },
    description: {
        type: String
    },
}, {
    timestamps: true
});

const Seance = mongoose.model('seance', seanceSchema);
module.exports = Seance;