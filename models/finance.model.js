const mongoose = require('mongoose');

const finSchema = mongoose.Schema({
    user: {
        type : mongoose.Types.ObjectId,
        ref: 'user'
    },
    label : {
        type: String
    },
    type: {
        type: String
    },
    amount: {
        type: Number
    },
    isSpent: {
        type: Boolean,
    }
}, {
    timestamps: true
});


const Finance = mongoose.model('finance', finSchema);

module.exports = Finance;