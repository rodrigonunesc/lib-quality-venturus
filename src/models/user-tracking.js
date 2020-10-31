const mongoose = require('mongoose');

const UserProjectTrackingSchema = new mongoose.Schema({
  requestDate: { type: Date, default: Date.now },
  returnedApiData: Object,
  projectType: String,
});

const UserTrackingSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  trackings: [UserProjectTrackingSchema],
});

module.exports = mongoose.models.UserTracking || mongoose.model('UserTracking', UserTrackingSchema);
