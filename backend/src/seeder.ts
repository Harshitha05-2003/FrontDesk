import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Doctor } from './doctors/doctor.entity';
import * as bcrypt from 'bcryptjs';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userRepository = app.get(getRepositoryToken(User));
    const doctorRepository = app.get(getRepositoryToken(Doctor));

    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      // Create admin user
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
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Check if sample doctors exist
    const existingDoctors = await doctorRepository.count();
    
    if (existingDoctors === 0) {
      // Create sample doctors
      const sampleDoctors = [
        {
          firstName: 'John',
          lastName: 'Smith',
          specialization: 'general' as any,
          gender: 'male' as any,
          location: 'Main Clinic',
          description: 'General practitioner with 10 years of experience',
          isAvailable: true,
        },
        {
          firstName: 'Sarah',
          lastName: 'Johnson',
          specialization: 'cardiology' as any,
          gender: 'female' as any,
          location: 'Cardiology Wing',
          description: 'Cardiologist specializing in heart conditions',
          isAvailable: true,
        },
        {
          firstName: 'Michael',
          lastName: 'Brown',
          specialization: 'dermatology' as any,
          gender: 'male' as any,
          location: 'Dermatology Clinic',
          description: 'Dermatologist with expertise in skin conditions',
          isAvailable: true,
        },
        {
          firstName: 'Emily',
          lastName: 'Davis',
          specialization: 'pediatrics' as any,
          gender: 'female' as any,
          location: 'Children\'s Wing',
          description: 'Pediatrician specializing in child healthcare',
          isAvailable: true,
        },
        {
          firstName: 'David',
          lastName: 'Wilson',
          specialization: 'orthopedics' as any,
          gender: 'male' as any,
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
    } else {
      console.log('ℹ️ Sample doctors already exist');
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

seed();
