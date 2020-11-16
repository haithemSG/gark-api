const mongoose = require('mongoose');


const reservationSchema = mongoose.Schema({
    name: {
        type: String
    },
    num: {
        type: String
    },
    terrain: {
        type: mongoose.Types.ObjectId,
        ref: 'terrain'
    },
    frais: {
        type : Number,
        default :0
    },
    StartTime: {
        type: Date
    },
    EndTime: {
        type: Date
    }
}, {
    timestamps: true
});

const Resercation = mongoose.model('reservation', reservationSchema);
module.exports = Resercation;