const ClientRequest = require('../models/ClientRequest');
const sendEmail = require('../utils/sendEmail');

exports.createRequest = async (req, res) => {
  try {
    const newRequest = new ClientRequest(req.body);
    await newRequest.save();

    // Send email to admin
    await sendEmail(process.env.GMAIL_USER, 'New Client Request', `
      <h1>New Client Request</h1>
      <p><b>Company:</b> ${req.body.companyName}</p>
      <p><b>Contact:</b> ${req.body.contactPerson} (${req.body.email})</p>
      <p><b>Service:</b> ${req.body.service}</p>
    `);

    // Send confirmation to client
    await sendEmail(req.body.email, 'We received your request', `
      <p>Hi ${req.body.contactPerson},</p>
      <p>Thanks for reaching out to Alanxa. We have received your request and will get back to you shortly.</p>
    `);

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
