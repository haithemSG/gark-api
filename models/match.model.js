const mongoose = require('mongoose');


const matchSchema = mongoose.Schema({
    titre: {
        type: String
    },
    teamA: {
        type: mongoose.Types.ObjectId,
        ref: 'group'
    },
    teamB: {
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
        type: String
    },
    type: {
        type: mongoose.Types.ObjectId,
        ref: 'event'
    }
}, {
    timestamps: true
});

const eventSchema = mongoose.Schema({
    label: {
        type: String
    },
    officiel: {
        type: Boolean
    }
});



const Match = mongoose.model('match', matchSchema);
const Event = mongoose.model('event', eventSchema);

module.exports = {Match , Event};