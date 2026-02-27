const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const RoadmapSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    steps: [StepSchema]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);
