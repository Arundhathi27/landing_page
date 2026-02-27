const Roadmap = require('../models/Roadmap');

// --- Roadmap Management (CRUD) ---

// Create a roadmap
exports.createRoadmap = async (req, res) => {
    try {
        const { title, steps } = req.body;
        const roadmap = new Roadmap({ title, steps: steps || [] });
        await roadmap.save();
        res.status(201).json(roadmap);
    } catch (err) {
        res.status(400).json({ message: 'Error creating roadmap', error: err.message });
    }
};

// Retrieve all roadmaps
exports.getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
        res.status(200).json(roadmaps);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching roadmaps', error: err.message });
    }
};

// Retrieve a single roadmap
exports.getRoadmapById = async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        // Sort steps by order before returning
        roadmap.steps.sort((a, b) => a.order - b.order);

        res.status(200).json(roadmap);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching roadmap', error: err.message });
    }
};

// Update a roadmap title
exports.updateRoadmap = async (req, res) => {
    try {
        const { title } = req.body;
        const roadmap = await Roadmap.findByIdAndUpdate(
            req.params.id,
            { title },
            { new: true, runValidators: true }
        );
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
        res.status(200).json(roadmap);
    } catch (err) {
        res.status(400).json({ message: 'Error updating roadmap', error: err.message });
    }
};

// Delete a roadmap
exports.deleteRoadmap = async (req, res) => {
    try {
        const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
        res.status(200).json({ message: 'Roadmap deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting roadmap', error: err.message });
    }
};


// --- Step Management (Nested CRUD) ---

// Add a new step
exports.addStep = async (req, res) => {
    try {
        const { name, order } = req.body;
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        roadmap.steps.push({ name, order });
        await roadmap.save();

        // Return the newly added step
        const newStep = roadmap.steps[roadmap.steps.length - 1];
        res.status(201).json(newStep);
    } catch (err) {
        res.status(400).json({ message: 'Error adding step', error: err.message });
    }
};

// Edit an existing step
exports.updateStep = async (req, res) => {
    try {
        const { name, order } = req.body;
        const roadmap = await Roadmap.findById(req.params.roadmapId);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        const step = roadmap.steps.id(req.params.stepId);
        if (!step) return res.status(404).json({ message: 'Step not found' });

        if (name !== undefined) step.name = name;
        if (order !== undefined) step.order = order;

        await roadmap.save();
        res.status(200).json(step);
    } catch (err) {
        res.status(400).json({ message: 'Error updating step', error: err.message });
    }
};

// Delete a step
exports.deleteStep = async (req, res) => {
    try {
        const roadmap = await Roadmap.findById(req.params.roadmapId);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        const stepIndex = roadmap.steps.findIndex(s => s._id.toString() === req.params.stepId);
        if (stepIndex === -1) return res.status(404).json({ message: 'Step not found' });

        roadmap.steps.splice(stepIndex, 1);
        await roadmap.save();

        res.status(200).json({ message: 'Step deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting step', error: err.message });
    }
};

// Reorder steps (Batch update)
exports.reorderSteps = async (req, res) => {
    try {
        const { steps } = req.body; // Expecting array of { id, order }
        const roadmap = await Roadmap.findById(req.params.id);
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        steps.forEach(({ id, order }) => {
            const step = roadmap.steps.id(id);
            if (step) step.order = order;
        });

        // Optionally re-sort the array in the document (DB handles it gracefully if not)
        roadmap.steps.sort((a, b) => a.order - b.order);

        await roadmap.save();
        res.status(200).json(roadmap.steps);
    } catch (err) {
        res.status(400).json({ message: 'Error reordering steps', error: err.message });
    }
};
