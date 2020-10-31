const mongoose = require('mongoose');

const VisitTrackingSchema = new mongoose.Schema({
  requestDate: { type: Date, default: Date.now },
  returnedApiData: Object,
});

const ProjectTrackingSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  trackings: [VisitTrackingSchema],
});

module.exports = mongoose.models.ProjectTracking || mongoose.models('ProjectTracking', ProjectTrackingSchema);
