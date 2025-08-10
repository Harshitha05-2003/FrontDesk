"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const doctor_entity_1 = require("./doctors/doctor.entity");
const bcrypt = require("bcryptjs");
async function seed() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const userRepository = app.get((0, typeorm_1.getRepositoryToken)(user_entity_1.User));
        const doctorRepository = app.get((0, typeorm_1.getRepositoryToken)(doctor_entity_1.Doctor));
        const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('password', 10);
            const adminUser = userRepository.create({
                username: 'admin',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isActive: true,
            });
            await userRepository.save(adminUser);
            console.log('✅ Admin user created');
        }
        else {
            console.log('ℹ️ Admin user already exists');
        }
        const existingDoctors = await doctorRepository.count();
        if (existingDoctors === 0) {
            const sampleDoctors = [
                {
                    firstName: 'John',
                    lastName: 'Smith',
                    specialization: 'general',
                    gender: 'male',
                    location: 'Main Clinic',
                    description: 'General practitioner with 10 years of experience',
                    isAvailable: true,
                },
                {
                    firstName: 'Sarah',
                    lastName: 'Johnson',
                    specialization: 'cardiology',
                    gender: 'female',
                    location: 'Cardiology Wing',
                    description: 'Cardiologist specializing in heart conditions',
                    isAvailable: true,
                },
                {
                    firstName: 'Michael',
                    lastName: 'Brown',
                    specialization: 'dermatology',
                    gender: 'male',
                    location: 'Dermatology Clinic',
                    description: 'Dermatologist with expertise in skin conditions',
                    isAvailable: true,
                },
                {
                    firstName: 'Emily',
                    lastName: 'Davis',
                    specialization: 'pediatrics',
                    gender: 'female',
                    location: 'Children\'s Wing',
                    description: 'Pediatrician specializing in child healthcare',
                    isAvailable: true,
                },
                {
                    firstName: 'David',
                    lastName: 'Wilson',
                    specialization: 'orthopedics',
                    gender: 'male',
                    location: 'Orthopedics Department',
                    description: 'Orthopedic surgeon with focus on joint and bone health',
                    isAvailable: true,
                },
            ];
            for (const doctorData of sampleDoctors) {
                const doctor = doctorRepository.create(doctorData);
                await doctorRepository.save(doctor);
            }
            console.log('✅ Sample doctors created');
        }
        else {
            console.log('ℹ️ Sample doctors already exist');
        }
        console.log('🎉 Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
    }
    finally {
        await app.close();
    }
}
seed();
//# sourceMappingURL=seeder.js.map