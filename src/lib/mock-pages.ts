// Generate mock website pages based on industry and URL
export function generateMockPages(industry: string, websiteUrl: string): string[] {
  const industryPages: Record<string, string[]> = {
    'Window Cleaning': [
      'Residential Window Cleaning',
      'Commercial Window Cleaning',
      'Pressure Washing Services',
      'Gutter Cleaning',
      'Pricing & Packages',
      'Free Quote Request',
    ],
    'Dental': [
      'General Dentistry',
      'Cosmetic Dentistry',
      'Teeth Whitening',
      'Invisalign & Orthodontics',
      'New Patient Specials',
      'Insurance & Payment Plans',
    ],
    'Real Estate': [
      'Homes for Sale',
      'Property Listings',
      'Sell Your Home',
      'Market Analysis',
      'First-Time Buyers Guide',
      'Investment Properties',
    ],
    'HVAC': [
      'AC Repair & Installation',
      'Furnace Services',
      'Duct Cleaning',
      'Maintenance Plans',
      'Emergency Repair',
      'Free Estimate',
    ],
    'Legal': [
      'Personal Injury',
      'Family Law',
      'Estate Planning',
      'Business Law',
      'Free Consultation',
      'Case Results',
    ],
    'Blinds': [
      'Wood Blinds',
      'Faux Wood Blinds',
      'Roller Shades',
      'Shutters & Plantation',
      'Free In-Home Consultation',
      'Current Promotions',
    ],
    'Landscaping': [
      'Lawn Care Services',
      'Landscape Design',
      'Hardscaping',
      'Seasonal Cleanup',
      'Irrigation Systems',
      'Free Estimate',
    ],
    'Plumbing': [
      'Drain Cleaning',
      'Water Heater Services',
      'Pipe Repair',
      'Emergency Plumbing',
      'Bathroom Remodel',
      'Service Plans',
    ],
    'Auto Repair': [
      'Oil Change & Tune-Up',
      'Brake Services',
      'Engine Diagnostics',
      'Tire Services',
      'Collision Repair',
      'Service Specials',
    ],
    'Insurance': [
      'Auto Insurance',
      'Home Insurance',
      'Life Insurance',
      'Business Insurance',
      'Get a Free Quote',
      'Claims Center',
    ],
    'Fitness': [
      'Membership Plans',
      'Personal Training',
      'Group Classes',
      'Free Trial Pass',
      'Nutrition Coaching',
      'Class Schedule',
    ],
  };

  const defaultPages = [
    'Services',
    'About Us',
    'Pricing',
    'Contact Us',
    'Free Consultation',
    'Testimonials',
  ];

  return industryPages[industry] || defaultPages;
}
