const functions = require('firebase-functions');
const { teacherSignup } = require('./api/teacher-signup');

// Export all functions
exports.teacherSignup = teacherSignup;
