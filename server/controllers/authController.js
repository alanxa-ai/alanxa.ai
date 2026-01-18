const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail, sendOtpEmail } = require('../utils/sendEmail');
const { getOtpTemplate, getConfirmationTemplate } = require('../utils/emailTemplates');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    try {
        console.log('--- Register Request Received ---');
        const { name, email: rawEmail, password } = req.body;
        console.log('Request Body:', { name, email: rawEmail });

        const email = rawEmail.trim().toLowerCase();
        console.log('Normalized Email:', email);

        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            console.log('User already exists and is verified');
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const hashedPassword = await bcrypt.hash(password, 10);

        if (user && !user.isVerified) {
            console.log('Updating existing unverified user');
            // Update existing unverified user
            user.name = name;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            console.log('Creating new user');
            // Create new user
            user = new User({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false
            });
            await user.save();
        }

        console.log('Attempting to send OTP email...');
        const emailContent = getOtpTemplate(otp);
        try {
            await sendOtpEmail(email, `Alanxa Verification Code: ${otp}`, emailContent);
            console.log('OTP Email sent successfully');
        } catch (emailError) {
            console.error('Critical Email Sending Error:', emailError);
            // Consider if we should fail the request or just log it
        }

        res.status(201).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Send confirmation/welcome email
        try {
            const confirmContent = getConfirmationTemplate(user.name, "account verification");
            await sendEmail(user.email, "Welcome to Alanxa - Account Verified", confirmContent);
        } catch (mailErr) {
            console.error("Confirmation email failed", mailErr);
            // Don't fail the request if just the confirmation email fails
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Email verified', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email: rawEmail, password } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.googleAuth = async (req, res) => {
    try {
        const { tokenId } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            user = new User({
                name,
                email,
                googleId: sub,
                isVerified: true,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10) // Random password
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Google Auth Failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const emailContent = getOtpTemplate(otp);
        await sendOtpEmail(email, 'Password Reset OTP', emailContent);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email: rawEmail, otp, newPassword } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
