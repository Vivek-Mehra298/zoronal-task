import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  logoUrl: {
    type: String,
    required: [true, 'Logo URL is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  foundedOn: {
    type: Number,
    required: [true, 'Founded year is required'],
  },
}, { 
  timestamps: true 
});

const Company = mongoose.model('Company', companySchema);
export default Company;
