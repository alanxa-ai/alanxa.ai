const mongoose = require('mongoose');
const User = require('./server/models/User');
const Project = require('./server/models/Project');
require('dotenv').config({ path: './server/.env' });

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({});
        console.log('\n=== USERS ===');
        users.forEach(u => console.log(`ID: ${u._id}, Name: ${u.name}, Email: ${u.email}, Role: ${u.role}`));

        const projects = await Project.find({});
        console.log('\n=== PROJECTS ===');
        projects.forEach(p => {
            console.log(`ID: ${p._id}, Title: ${p.title}`);
            console.log(`   Client: ${p.client}`);
            console.log(`   Legacy Freelancer: ${p.freelancer}`);
            console.log(`   Freelancers Array: ${p.freelancers}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
