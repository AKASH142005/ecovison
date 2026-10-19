export const SEED_USERS = [
  {
    _id: 'usr_customer_1',
    name: 'Kavitha Ramachandran',
    email: 'customer@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'customer',
    phone: '+91 98401 23456',
    district: 'Anna Nagar',
    address: '14, 2nd Main Road, Anna Nagar, Chennai 600040'
  },
  {
    _id: 'usr_dealer_1',
    name: 'Rajesh Selvam (Guindy Eco-Recovery)',
    email: 'dealer@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'dealer',
    phone: '+91 94441 23489',
    district: 'Guindy',
    address: 'Plot 42, SIDCO Industrial Estate, Guindy, Chennai 600032',
    facilityName: 'Guindy Eco-Recovery Industrial Hub',
    facilityId: 'mem_col_1',
    serviceRadiusKm: 8,
    serviceWards: ['Guindy', 'Saidapet', 'Alandur', 'Ekkatuthangal', 'Jafferkhanpet'],
    lat: 13.0067,
    lng: 80.2012
  },
  {
    _id: 'usr_factory_1',
    name: 'Anand Kumar (Manali Eco-Polymers Ltd)',
    email: 'factory@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'factory',
    phone: '+91 98402 99887',
    district: 'Manali',
    address: 'Expressway Petrochemical Complex, Manali, Chennai 600068',
    facilityName: 'Manali Eco-Polymers Ltd',
    facilityId: 'fac_manali_1',
    lat: 13.1670,
    lng: 80.2600
  },
  {
    _id: 'usr_admin_1',
    name: 'Dr. S. Meenakshi (GCC City Environmental Officer)',
    email: 'admin@ecovision.tn',
    password: '$2b$10$xEi7ez64xAItubrnj69yveD7wo59noW9gInpq/KfKjF5e.NeDZIRC', // pass123
    role: 'admin',
    phone: '+91 44 2538 4145',
    district: 'Chennai Central',
    address: 'Greater Chennai Corporation (GCC), Ripon Building, Chennai 600003',
    facilityName: 'Greater Chennai Corporation & TNPCB Joint Directorate'
  }
];
