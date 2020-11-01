const mongoose = require('mongoose');

const UserProjectTrackingSchema = new mongoose.Schema({
  requestDate: { type: Date, default: Date.now },
  projectType: String,
  query: String,
  apiData: Object,
  status: Number,
});

const UserTrackingSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  visits: [UserProjectTrackingSchema],
});

module.exports = mongoose.models.UserTracking || mongoose.model('UserTracking', UserTrackingSchema);
