// models/Job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },      // e.g., "Software Developer"
  jobCode: { type: String, required: true },    // e.g., "NTC134"
  openings: Number,                             // e.g., 5
  location: String,                             // e.g., "Irving, TX"
  type: String,                                 // e.g., "Full Time"
  hours: String,                                // e.g., "40 Hours/week"
  experience: String,                           // e.g., "3+ Years"
  email: String,                                // Contact email
  description: String,                          // Full job description
  duties: [String],                             // Array of duties
  education: [String],                          // Education requirements
  postedOn: Date                                // Posting date
}, { timestamps: true });

//  Prevent OverwriteModelError
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

module.exports = Job;
