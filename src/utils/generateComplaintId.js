const crypto = require('crypto');

const generateComplaintId = () => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  return `CMP-${timestamp}-${random}`;
};

module.exports = generateComplaintId;
