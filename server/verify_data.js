const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const fs = require('fs');
require('dotenv').config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        fs.writeFileSync('users_dump.json', JSON.stringify(users, null, 2));

        const projects = await Project.find({});
        fs.writeFileSync('projects_dump.json', JSON.stringify(projects, null, 2));

        console.log('Dumped to users_dump.json and projects_dump.json');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verify();
