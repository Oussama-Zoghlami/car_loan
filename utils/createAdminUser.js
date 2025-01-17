const bcrypt = require('bcrypt');
const User = require('../models/user');


const createAdminUser = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync('admin123', salt); // Default admin password

            const admin = new User({
                name: 'Admin',
                lastname: 'User',
                age: 30,
                email: 'admin@example.com', // Default admin email
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

module.exports = createAdminUser;