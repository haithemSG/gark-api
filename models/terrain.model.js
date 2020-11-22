const mongoose = require('mongoose');


const terrainSchema = mongoose.Schema({
    name: {
        type: String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    image: {
        type: String
    },
    address: {
        type: String
    },
    color: {
        type: String
    },
    geoloacation: {
        lang: {
            type: Number
        },
        lat: {
            type: Number
        }
    }
}, {
    timestamps: true
});

const Terrain = mongoose.model('terrain', terrainSchema);
module.exports = Terrain;