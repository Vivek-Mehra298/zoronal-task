import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from './models/Company.js';
import Review from './models/Review.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/company_reviews';

const mockCompanies = [
  {
    name: 'Zoronal Solutions',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    description: 'An industry leader in generative AI automation, cloud systems orchestration, and premium modern user experience interfaces.',
    location: 'Silicon Valley, California',
    city: 'San Jose',
    foundedOn: 2022,
  },
  {
    name: 'Stripe',
    logoUrl: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?w=150&auto=format&fit=crop&q=80',
    description: 'A global technology company building economic infrastructure for the internet. Millions of businesses use Stripe to accept payments.',
    location: 'Market Street, San Francisco',
    city: 'San Francisco',
    foundedOn: 2010,
  },
  {
    name: 'Vercel',
    logoUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=150&auto=format&fit=crop&q=80',
    description: 'Vercel provides the developer experience and infrastructure to build, deploy, and scale highly performant front-end web applications.',
    location: 'Broadway, New York',
    city: 'New York',
    foundedOn: 2015,
  },
  {
    name: 'Linear',
    logoUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=80',
    description: 'Linear helps software teams streamline projects, sprint planning, tasks, and bug tracking. Built for high-performance product teams.',
    location: 'Design District, San Francisco',
    city: 'San Francisco',
    foundedOn: 2019,
  }
];

const mockReviews = [
  {
    companyName: 'Zoronal Solutions',
    fullName: 'Sophia Chen',
    subject: 'Stunning engineering culture and bleeding-edge tech!',
    reviewText: 'Working at Zoronal has been absolute heaven. We use advanced agents and automated pair-programming architectures to ship modern web platforms. The compensation is fantastic, the workspace is dynamic, and there is immense growth potential.',
    rating: 5,
    likes: 12,
  },
  {
    companyName: 'Zoronal Solutions',
    fullName: 'Marcus Vance',
    subject: 'Fast-paced, exciting, but high expectations',
    reviewText: 'Zoronal moves incredibly fast. You are surrounded by absolute geniuses. The work-life balance can occasionally blur due to how enthusiastic everyone is about the tech, but the rewards and bonuses make it extremely worthwhile.',
    rating: 4,
    likes: 8,
  },
  {
    companyName: 'Stripe',
    fullName: 'Jared Miller',
    subject: 'Incredible APIs, brilliant colleagues',
    reviewText: 'Stripe is an exceptional company with standard-setting API design guidelines. The engineering talent is elite. Management is highly structured and focuses heavily on long-term goals.',
    rating: 5,
    likes: 24,
  },
  {
    companyName: 'Stripe',
    fullName: 'Elena Rostova',
    subject: 'Good benefits but growing bureaucracy',
    reviewText: 'Stripe is no longer a small startup. There is standard corporate overhead and processes. Still, the tooling, salaries, and benefits are top-tier in the industry.',
    rating: 4,
    likes: 15,
  },
  {
    companyName: 'Vercel',
    fullName: 'Kenji Sato',
    subject: 'The absolute best DX on the planet',
    reviewText: 'Vercel actually lives and breathes developer experience. The product focus is supreme, and shipping features directly into production via a simple git push is amazing. Highly collaborative team.',
    rating: 5,
    likes: 30,
  },
  {
    companyName: 'Linear',
    fullName: 'Alice Sterling',
    subject: 'Precision engineering and beautiful designs',
    reviewText: 'Linear values craftsmanship over everything else. If you appreciate clean code, highly optimized user experiences, and minimal meetings, this is the absolute place to be.',
    rating: 5,
    likes: 18,
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');

    // Clear existing data
    console.log('Clearing old collections...');
    await Company.deleteMany({});
    await Review.deleteMany({});
    console.log('Collections cleared.');

    // Seed companies
    console.log('Seeding companies...');
    const insertedCompanies = await Company.insertMany(mockCompanies);
    console.log(`Seeded ${insertedCompanies.length} companies successfully.`);

    // Seed reviews
    console.log('Seeding reviews...');
    const reviewsWithIds = [];

    for (const review of mockReviews) {
      const company = insertedCompanies.find(c => c.name === review.companyName);
      if (company) {
        reviewsWithIds.push({
          companyId: company._id,
          fullName: review.fullName,
          subject: review.subject,
          reviewText: review.reviewText,
          rating: review.rating,
          likes: review.likes,
        });
      }
    }

    const insertedReviews = await Review.insertMany(reviewsWithIds);
    console.log(`Seeded ${insertedReviews.length} reviews successfully.`);

    console.log('Database seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
