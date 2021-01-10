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
        type: String
    },
}, {
    timestamps: true
});

const Seance = mongoose.model('seance', seanceSchema);
module.exports = Seance;