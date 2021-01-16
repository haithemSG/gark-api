const mongoose = require('mongoose');


const seanceSchema = mongoose.Schema({
    titre: {
        type: String
    },
    entraineur: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    group: {
        type: mongoose.Types.ObjectId,
        ref: 'group'
    },
    StartTime: {
        type: Date
    },
    EndTime: {
        type: Date
    },
    description: {
        type: String //Objectifs
    },
    isAchieved : {
        type: Boolean
    },
    type: {
        type: mongoose.Types.ObjectId,
        ref: 'event'
    }
}, {
    timestamps: true
});

const Seance = mongoose.model('seance', seanceSchema);
module.exports = Seance;