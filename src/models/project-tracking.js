const mongoose = require('mongoose');

const VisitTrackingSchema = new mongoose.Schema({
  requestDate: { type: Date, default: Date.now },
  apiData: Object,
});

const ProjectTrackingSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  visits: [VisitTrackingSchema],
});

module.exports = mongoose.models.ProjectTracking || mongoose.model('ProjectTracking', ProjectTrackingSchema);
