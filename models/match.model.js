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
}, {
    timestamps: true
});

const Match = mongoose.model('match', matchSchema);
module.exports = Match;