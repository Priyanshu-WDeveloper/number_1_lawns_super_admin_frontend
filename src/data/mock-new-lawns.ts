import type {
  NewLawnService,
  NewLawnLead,
  NewLawnReview,
  NewLawnFAQ,
  NewLawnArea,
  NewLawnGalleryItem,
  NewLawnPageContent,
  NewLawnContactInfo,
  NewLawnTeamMember,
  NewLawnPromotion,
  NewLawnListParams,
} from '@/types/new-lawns.types';

let idCounter = 100;

const nextId = () => String(++idCounter);

const now = new Date().toISOString();

export const mockServices: NewLawnService[] = [
  {
    _id: '1',
    slug: 'artificial-grass-installation',
    title: 'Artificial Grass Installation',
    description: 'Premium synthetic turf installation for residential and commercial properties. Our team handles everything from ground preparation to final grooming.',
    price: 'From $120/m²',
    category: 'installation',
    status: 'active',
    features: ['Ground preparation', 'Weed membrane', 'Shock pad layer', 'Premium turf', 'Infill sand', 'Final brush'],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-05-20T14:30:00Z',
  },
  {
    _id: '2',
    slug: 'natural-turf-laying',
    title: 'Natural Turf Laying',
    description: 'Professional instant lawn installation using premium NZ-grown turf varieties suitable for your specific conditions.',
    price: 'From $85/m²',
    category: 'installation',
    status: 'active',
    features: ['Soil preparation', 'Fertiliser application', 'Turf laying', 'Initial watering', 'Rolling'],
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-05-18T09:15:00Z',
  },
  {
    _id: '3',
    slug: 'lawn-design-planning',
    title: 'Lawn Design & Planning',
    description: 'Expert consultation and design services to plan your perfect lawn, including drainage solutions and irrigation planning.',
    price: 'From $250',
    category: 'design',
    status: 'active',
    features: ['Site assessment', 'Drainage plan', 'Irrigation design', 'Turf selection', '3D concept', 'Project timeline'],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-05-15T11:00:00Z',
  },
  {
    _id: '4',
    slug: 'synthetic-putting-green',
    title: 'Synthetic Putting Green',
    description: 'Custom-designed artificial putting greens for golf enthusiasts, with true ball roll and professional-grade turf.',
    price: 'From $150/m²',
    category: 'installation',
    status: 'active',
    features: ['Custom contouring', 'Pro-grade turf', 'Fringe/rough areas', 'Cup installation', 'Ball return option'],
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-05-10T16:00:00Z',
  },
  {
    _id: '5',
    slug: 'lawn-maintenance-plans',
    title: 'Lawn Maintenance Plans',
    description: 'Ongoing care packages to keep your new lawn healthy and beautiful all year round.',
    price: 'From $45/week',
    category: 'maintenance',
    status: 'active',
    features: ['Regular mowing', 'Fertilising', 'Weed control', 'Aeration', 'Seasonal treatments'],
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-05-22T08:00:00Z',
  },
  {
    _id: '6',
    slug: 'hydroseeding',
    title: 'Hydroseeding',
    description: 'Cost-effective lawn establishment using hydroseeding technology for rapid germination and even coverage.',
    price: 'From $65/m²',
    category: 'installation',
    status: 'active',
    features: ['Slope erosion control', 'Rapid germination', 'Custom seed mix', 'Mulch application', 'Fertiliser included'],
    createdAt: '2025-03-10T10:00:00Z',
    updatedAt: '2025-05-12T13:45:00Z',
  },
  {
    _id: '7',
    slug: 'pet-friendly-turf',
    title: 'Pet-Friendly Artificial Turf',
    description: 'Specialised artificial grass designed for pets with enhanced drainage, odour control, and durable fibres.',
    price: 'From $135/m²',
    category: 'installation',
    status: 'active',
    features: ['Enhanced drainage', 'Odour neutraliser', 'Non-toxic materials', 'Stain resistant', 'Heavy traffic rated'],
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-05-08T10:30:00Z',
  },
  {
    _id: '8',
    slug: 'garden-landscaping',
    title: 'Garden Landscaping',
    description: 'Complete garden transformation including new lawn areas, planting, pathways, and outdoor living spaces.',
    price: 'From $2,000',
    category: 'design',
    status: 'inactive',
    features: ['Full design service', 'Planting plans', 'Hardscaping', 'Irrigation systems', 'Lighting', 'Project management'],
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-30T12:00:00Z',
  },
];

export const mockLeads: NewLawnLead[] = [
  {
    _id: 'l1',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '021 345 6789',
    address: '45 Kowhai Road',
    city: 'Auckland',
    service: 'Artificial Grass Installation',
    propertySize: 'Medium (50-100m²)',
    preferredDate: '2025-06-15',
    message: 'Looking to replace my patchy lawn with artificial grass in my backyard.',
    status: 'new',
    createdAt: '2025-05-25T09:00:00Z',
    updatedAt: '2025-05-25T09:00:00Z',
  },
  {
    _id: 'l2',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@email.com',
    phone: '022 456 7890',
    address: '78 Tui Street',
    city: 'Hamilton',
    service: 'Natural Turf Laying',
    propertySize: 'Large (100-200m²)',
    message: 'New build property needing full section turfing.',
    status: 'contacted',
    notes: 'Called back - scheduling site visit for next week.',
    createdAt: '2025-05-23T14:00:00Z',
    updatedAt: '2025-05-24T10:30:00Z',
  },
  {
    _id: 'l3',
    firstName: 'Emily',
    lastName: 'Thompson',
    email: 'emily.t@email.com',
    phone: '027 567 8901',
    address: '12 Harbour View Rd',
    city: 'Tauranga',
    service: 'Synthetic Putting Green',
    propertySize: 'Small (under 50m²)',
    preferredDate: '2025-07-01',
    message: 'Would like a small putting green in my backyard - about 30m².',
    status: 'quoted',
    notes: 'Quote sent for $4,500 - waiting for response.',
    createdAt: '2025-05-20T11:00:00Z',
    updatedAt: '2025-05-22T15:00:00Z',
  },
  {
    _id: 'l4',
    firstName: 'Michael',
    lastName: 'Baker',
    email: 'michael.b@email.com',
    phone: '021 678 9012',
    address: '3 Oak Avenue',
    city: 'Wellington',
    service: 'Pet-Friendly Artificial Turf',
    propertySize: 'Medium (50-100m²)',
    preferredDate: '2025-06-20',
    message: 'Two dogs, need durable turf that can handle them.',
    status: 'won',
    notes: 'Signed contract - installation scheduled for 20 June.',
    createdAt: '2025-05-15T08:00:00Z',
    updatedAt: '2025-05-26T09:00:00Z',
  },
  {
    _id: 'l5',
    firstName: 'Lisa',
    lastName: 'Zhang',
    email: 'lisa.z@email.com',
    phone: '022 789 0123',
    address: '56 Rimu Street',
    city: 'Christchurch',
    service: 'Lawn Design & Planning',
    message: 'New section needs complete lawn design with irrigation.',
    status: 'lost',
    notes: 'Chose another provider - budget concerns.',
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2025-05-18T16:00:00Z',
  },
  {
    _id: 'l6',
    firstName: 'David',
    lastName: 'Cooper',
    email: 'david.c@email.com',
    phone: '027 890 1234',
    address: '89 Pohutukawa Drive',
    city: 'Auckland',
    service: 'Hydroseeding',
    propertySize: 'Large (100-200m²)',
    message: 'Sloped section needs erosion control and grass establishment.',
    status: 'new',
    createdAt: '2025-05-26T09:00:00Z',
    updatedAt: '2025-05-26T09:00:00Z',
  },
];

export const mockReviews: NewLawnReview[] = [
  {
    _id: 'r1',
    customerName: 'John & Mary Smith',
    rating: 5,
    text: 'Absolutely thrilled with our new artificial lawn! The team was professional, punctual, and the quality is outstanding. Our backyard has been transformed.',
    service: 'Artificial Grass Installation',
    status: 'approved',
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-02T09:00:00Z',
  },
  {
    _id: 'r2',
    customerName: 'Rachel Green',
    rating: 5,
    text: 'The natural turf looks amazing. Much better than I expected. The soil preparation was thorough and the grass is thriving after just 2 weeks.',
    service: 'Natural Turf Laying',
    status: 'approved',
    createdAt: '2025-04-15T14:00:00Z',
    updatedAt: '2025-04-16T11:00:00Z',
  },
  {
    _id: 'r3',
    customerName: 'Tom Henderson',
    rating: 4,
    text: 'Good service overall. The putting green is great quality and the team was friendly. Took a bit longer than quoted but happy with the result.',
    service: 'Synthetic Putting Green',
    status: 'approved',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5eac566c79?w=400',
    createdAt: '2025-03-20T09:00:00Z',
    updatedAt: '2025-03-22T10:00:00Z',
  },
  {
    _id: 'r4',
    customerName: 'Anna Kowalski',
    rating: 5,
    text: 'Best decision we made for our rental property! The pet turf is incredible - our dogs love it and it still looks perfect after 3 months. Zero maintenance needed.',
    service: 'Pet-Friendly Artificial Turf',
    status: 'approved',
    createdAt: '2025-02-28T16:00:00Z',
    updatedAt: '2025-03-01T08:00:00Z',
  },
  {
    _id: 'r5',
    customerName: 'Peter Jackson',
    rating: 3,
    text: 'The hydroseeding is coming along but germination was patchy in some areas. They did come back to oversow though, so good aftercare service.',
    service: 'Hydroseeding',
    status: 'pending',
    createdAt: '2025-05-24T11:00:00Z',
    updatedAt: '2025-05-24T11:00:00Z',
  },
  {
    _id: 'r6',
    customerName: 'Samantha Lee',
    rating: 2,
    text: 'Disappointed with the timeline. Was told 2 weeks but took over a month. The final result is fine but communication was poor throughout.',
    service: 'Garden Landscaping',
    status: 'pending',
    createdAt: '2025-05-22T15:00:00Z',
    updatedAt: '2025-05-22T15:00:00Z',
  },
];

export const mockFAQs: NewLawnFAQ[] = [
  {
    _id: 'f1',
    question: 'How long does artificial grass last?',
    answer: 'Premium artificial grass typically lasts 15-20 years with proper care. Our installations come with a 10-year manufacturer warranty on the turf and a 5-year workmanship guarantee.',
    category: 'Artificial Grass',
    order: 1,
    status: 'active',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-05-01T09:00:00Z',
  },
  {
    _id: 'f2',
    question: 'What preparation is needed before laying new turf?',
    answer: 'Good soil preparation is essential. We remove existing grass, cultivate the soil to at least 150mm depth, add organic matter and fertiliser, then level and firm the surface before laying turf.',
    category: 'Natural Turf',
    order: 2,
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-04-20T14:00:00Z',
  },
  {
    _id: 'f3',
    question: 'Is artificial grass pet friendly?',
    answer: 'Yes! We offer specialised pet-friendly turf with enhanced drainage systems that prevent urine pooling, antimicrobial infill to control odours, and durable fibres that withstand heavy traffic and digging.',
    category: 'Artificial Grass',
    order: 3,
    status: 'active',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-05-10T11:00:00Z',
  },
  {
    _id: 'f4',
    question: 'When is the best time to lay new turf in NZ?',
    answer: 'While turf can be laid year-round in New Zealand, autumn (March-May) and spring (September-November) are ideal as the soil is warm and there is adequate rainfall for establishment. However, with proper watering, summer installations are also successful.',
    category: 'Natural Turf',
    order: 4,
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-04-15T09:00:00Z',
  },
  {
    _id: 'f5',
    question: 'How much does a new lawn cost?',
    answer: 'Costs vary depending on size, preparation work, turf type, and site accessibility. Natural turf starts from $85/m², artificial grass from $120/m², and hydroseeding from $65/m². We provide free no-obligation quotes for all projects.',
    category: 'General',
    order: 5,
    status: 'active',
    createdAt: '2025-02-10T10:00:00Z',
    updatedAt: '2025-05-05T13:00:00Z',
  },
  {
    _id: 'f6',
    question: 'Do you provide maintenance after installation?',
    answer: 'Yes, we offer ongoing maintenance plans for both natural and artificial lawns. Our plans include regular mowing, fertilising, weed control, aeration, and seasonal treatments to keep your lawn in pristine condition.',
    category: 'Maintenance',
    order: 6,
    status: 'active',
    createdAt: '2025-03-01T10:00:00Z',
    updatedAt: '2025-05-01T08:00:00Z',
  },
  {
    _id: 'f7',
    question: 'How long does artificial grass take to install?',
    answer: 'Most residential installations take 2-4 days depending on the size and complexity. A standard backyard (50-80m²) typically takes 2-3 days including ground preparation, base installation, turf laying, and finishing.',
    category: 'Artificial Grass',
    order: 7,
    status: 'active',
    createdAt: '2025-03-15T10:00:00Z',
    updatedAt: '2025-04-10T15:00:00Z',
  },
  {
    _id: 'f8',
    question: 'What areas do you service?',
    answer: 'We currently service Auckland, Hamilton, Tauranga, Wellington, and Christchurch metropolitan areas. For larger projects, we may be able to arrange service to surrounding regions - please contact us to discuss.',
    category: 'General',
    order: 8,
    status: 'active',
    createdAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z',
  },
];

export const mockAreas: NewLawnArea[] = [
  {
    _id: 'a1',
    name: 'Auckland',
    region: 'North Island - North',
    description: 'Greater Auckland region including North Shore, East Auckland, West Auckland, South Auckland, and Central suburbs. Specialists in clay soil preparation and coastal turf varieties.',
    status: 'active',
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-05-15T14:00:00Z',
  },
  {
    _id: 'a2',
    name: 'Hamilton',
    region: 'North Island - Central',
    description: 'Hamilton city and surrounding Waikato region. Experts in volcanic soil preparation and large-section turfing for the region\'s expanding residential areas.',
    status: 'active',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-05-10T11:00:00Z',
  },
  {
    _id: 'a3',
    name: 'Tauranga',
    region: 'North Island - Central',
    description: 'Tauranga city, Mount Maunganui, Papamoa, and Western Bay of Plenty. Specialists in sandy soil preparation and coastal grass varieties that thrive in the Bay of Plenty climate.',
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-05-08T09:00:00Z',
  },
  {
    _id: 'a4',
    name: 'Wellington',
    region: 'North Island - South',
    description: 'Wellington region including Hutt Valley, Porirua, and Kapiti Coast. Experienced with windy site conditions, slope stabilisation, and native grass integration.',
    status: 'active',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-05-05T16:00:00Z',
  },
  {
    _id: 'a5',
    name: 'Christchurch',
    region: 'South Island',
    description: 'Greater Christchurch area including Selwyn and Waimakariri districts. Specialists in post-earthquake soil remediation and the unique Canterbury climate conditions.',
    status: 'active',
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z',
  },
];

export const mockGallery: NewLawnGalleryItem[] = [
  { _id: 'g1', title: 'Backyard Artificial Lawn', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600', category: 'artificial', status: 'active', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z' },
  { _id: 'g2', title: 'Natural Turf Installation', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600', category: 'natural', status: 'active', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-04-20T14:00:00Z' },
  { _id: 'g3', title: 'Putting Green Project', image: 'https://images.unsplash.com/photo-1587174486073-ae5eac566c79?w=600', category: 'before-after', status: 'active', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-05-10T11:00:00Z' },
  { _id: 'g4', title: 'Commercial Landscape', image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600', category: 'design', status: 'active', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-04-15T09:00:00Z' },
  { _id: 'g5', title: 'Pet Turf Installation', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600', category: 'artificial', status: 'active', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-05-05T13:00:00Z' },
  { _id: 'g6', title: 'Before - Patchy Lawn', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', category: 'before-after', status: 'active', createdAt: '2025-03-15T10:00:00Z', updatedAt: '2025-05-01T08:00:00Z' },
];

export const mockPageContent: NewLawnPageContent[] = [
  { _id: 'p1', page: 'home', section: 'hero', title: 'New Lawn Specialists NZ', subtitle: 'Professional artificial and natural turf installation across New Zealand', content: '', status: 'active', seoTitle: 'No.1 New Lawns | Professional Turf Installation NZ', seoDescription: 'Premium artificial grass and natural turf installation services in Auckland, Hamilton, Tauranga, Wellington, and Christchurch.', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z' },
  { _id: 'p2', page: 'home', section: 'features', title: 'Why Choose Us', subtitle: 'NZ-owned and operated with 10+ years experience', content: 'We specialise in transforming ordinary sections into stunning lawn spaces. From artificial grass to natural turf, our team delivers quality workmanship across New Zealand.', status: 'active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z' },
  { _id: 'p3', page: 'about', section: 'story', title: 'Our Story', subtitle: 'Passionate about Kiwi lawns', content: 'Founded in 2015, No.1 New Lawns has grown from a small Auckland operation to serving customers across the North and South Islands. Our team of certified installers brings decades of combined experience in turf management and landscape design.', status: 'active', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-04-15T14:00:00Z' },
  { _id: 'p4', page: 'services', section: 'hero', title: 'Our Services', content: 'From artificial grass to natural turf, we offer complete new lawn solutions tailored to your property.', status: 'active', seoTitle: 'New Lawn Services NZ | Artificial & Natural Turf', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-04-10T11:00:00Z' },
  { _id: 'p5', page: 'contact', section: 'hero', title: 'Get in Touch', subtitle: 'Free quotes and consultations', content: 'Ready to transform your lawn? Contact our team today.', status: 'active', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-04-05T09:00:00Z' },
  { _id: 'p6', page: 'gallery', section: 'hero', title: 'Our Work', content: 'Browse our portfolio of completed lawn projects across New Zealand.', status: 'active', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-04-01T10:00:00Z' },
  { _id: 'p7', page: 'reviews', section: 'hero', title: 'Customer Reviews', content: 'Hear from our happy customers about their new lawn experience.', status: 'active', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-03-20T10:00:00Z' },
  { _id: 'p8', page: 'areas', section: 'hero', title: 'Service Areas', content: 'We serve major centres across New Zealand.', status: 'active', createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-03-15T10:00:00Z' },
];

export const mockContactInfo: NewLawnContactInfo[] = [
  { _id: 'c1', type: 'phone', label: 'Phone', value: '022 323 4429', icon: 'Phone', order: 1, status: 'active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z' },
  { _id: 'c2', type: 'email', label: 'Email', value: 'info@no1lawns.co.nz', icon: 'Mail', order: 2, status: 'active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z' },
  { _id: 'c3', type: 'address', label: 'Head Office', value: '123 Queen Street, Auckland CBD 1010', icon: 'MapPin', order: 3, status: 'active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-04-20T14:00:00Z' },
  { _id: 'c4', type: 'hours', label: 'Business Hours', value: 'Mon-Fri: 7:30am - 5:30pm, Sat: 8am - 12pm', icon: 'Clock', order: 4, status: 'active', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-04-15T11:00:00Z' },
  { _id: 'c5', type: 'social', label: 'Facebook', value: 'facebook.com/no1lawnsnz', icon: 'Facebook', order: 5, status: 'active', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-04-10T09:00:00Z' },
  { _id: 'c6', type: 'social', label: 'Instagram', value: '@no1lawns_nz', icon: 'Instagram', order: 6, status: 'inactive', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-04-05T10:00:00Z' },
];

export const mockTeamMembers: NewLawnTeamMember[] = [
  {
    _id: 't1', name: 'Mike Thompson', role: 'Lead Installer',
    bio: '10+ years experience in artificial and natural turf installation. Certified landscape professional with expertise in complex residential and commercial projects.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', email: 'mike@no1lawns.co.nz', phone: '021 111 2233',
    order: 1, status: 'active', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-05-01T09:00:00Z',
  },
  {
    _id: 't2', name: 'Sarah Chen', role: 'Design Consultant',
    bio: 'Specialises in landscape design and turf selection. Helps clients choose the perfect grass type for their property and lifestyle needs.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', email: 'sarah@no1lawns.co.nz', phone: '022 222 3344',
    order: 2, status: 'active', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-04-28T14:00:00Z',
  },
  {
    _id: 't3', name: 'James Wilson', role: 'Project Manager',
    bio: 'Oversees all installation projects from initial site assessment to final handover. Ensures every job meets our quality standards and stays on schedule.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', email: 'james@no1lawns.co.nz', phone: '027 333 4455',
    order: 3, status: 'active', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-05-05T11:00:00Z',
  },
  {
    _id: 't4', name: 'Emma Davies', role: 'Customer Care Specialist',
    bio: 'Dedicated to providing exceptional customer service from first enquiry through to post-installation support. Your go-to contact for any questions.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', email: 'emma@no1lawns.co.nz', phone: '021 444 5566',
    order: 4, status: 'active', createdAt: '2025-02-01T10:00:00Z', updatedAt: '2025-05-10T09:00:00Z',
  },
  {
    _id: 't5', name: 'Tom Harris', role: 'Senior Installer',
    bio: 'Expert in artificial turf installation with a keen eye for detail. Specialises in putting greens and pet-friendly turf installations.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', email: 'tom@no1lawns.co.nz', phone: '022 555 6677',
    order: 5, status: 'active', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-05-02T16:00:00Z',
  },
  {
    _id: 't6', name: 'Lisa Brown', role: 'Admin & Scheduling Coordinator',
    bio: 'Keeps everything running smoothly behind the scenes. Manages scheduling, quotes, and office operations.',
    email: 'lisa@no1lawns.co.nz', phone: '027 666 7788',
    order: 6, status: 'inactive', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-04-20T10:00:00Z',
  },
];

export const mockPromotions: NewLawnPromotion[] = [
  {
    _id: 'pr1', title: 'Spring Special', description: 'Get 15% off all artificial grass installations this spring.',
    code: 'SPRING15', discountType: 'percentage', discountValue: 15, startDate: '2025-09-01', endDate: '2025-11-30',
    status: 'active', createdAt: '2025-08-01T10:00:00Z', updatedAt: '2025-08-01T10:00:00Z',
  },
  {
    _id: 'pr2', title: 'New Lawn Package', description: 'Save $200 on complete new lawn installations over $1,000.',
    code: 'LAWN200', discountType: 'fixed', discountValue: 200, minOrder: 1000, startDate: '2025-01-01', endDate: '2025-12-31',
    status: 'active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-06-01T09:00:00Z',
  },
  {
    _id: 'pr3', title: 'Referral Discount', description: 'Refer a friend and get $50 off your next service.',
    code: 'REFER50', discountType: 'fixed', discountValue: 50, startDate: '2025-01-01', endDate: '2025-12-31',
    status: 'active', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-05-15T14:00:00Z',
  },
  {
    _id: 'pr4', title: 'Summer Sale', description: 'Beat the heat with 10% off natural turf installations.',
    code: 'SUMMER10', discountType: 'percentage', discountValue: 10, startDate: '2025-12-01', endDate: '2026-02-28',
    status: 'active', createdAt: '2025-11-01T10:00:00Z', updatedAt: '2025-11-01T10:00:00Z',
  },
  {
    _id: 'pr5', title: 'Senior Discount', description: '20% discount for seniors on all turf laying services.',
    code: 'SENIOR20', discountType: 'percentage', discountValue: 20, startDate: '2025-01-01', endDate: '2025-06-30',
    status: 'inactive', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-06-30T23:59:00Z',
  },
  {
    _id: 'pr6', title: 'Bundle Deal', description: 'Save $150 when you book design + installation together.',
    code: 'BUNDLE150', discountType: 'fixed', discountValue: 150, minOrder: 2000, startDate: '2025-03-01', endDate: '2025-09-30',
    status: 'inactive', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-05-01T08:00:00Z',
  },
];

const allData = {
  services: [...mockServices],
  leads: [...mockLeads],
  reviews: [...mockReviews],
  faqs: [...mockFAQs],
  areas: [...mockAreas],
  gallery: [...mockGallery],
  pageContent: [...mockPageContent],
  contactInfo: [...mockContactInfo],
  teamMembers: [...mockTeamMembers],
  promotions: [...mockPromotions],
};

const paginate = <T>(
  items: T[],
  page: number,
  limit: number,
) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedItems = items.slice(start, end);
  return {
    items: paginatedItems,
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit),
  };
};

const filterBySearch = <T extends Record<string, any>>(
  items: T[],
  search: string | undefined,
  fields: (keyof T)[],
): T[] => {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) =>
      String(item[field] ?? '').toLowerCase().includes(q),
    ),
  );
};

const filterByStatus = <T extends { status: string }>(
  items: T[],
  status: string | undefined,
): T[] => {
  if (!status || status === 'All') return items;
  return items.filter(
    (item) => item.status.toLowerCase() === status.toLowerCase(),
  );
};

const delay = () => new Promise((r) => setTimeout(r, 200));

export const mockDb = {
  async getServices(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.services];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['title', 'description', 'category']);
    return paginate(items, page, limit);
  },

  async getServiceById(id: string) {
    await delay();
    return allData.services.find((s) => s._id === id) || null;
  },

  async createService(
    data: Omit<NewLawnService, '_id' | 'createdAt' | 'updatedAt'>,
  ) {
    await delay();
    const service: NewLawnService = {
      _id: nextId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    allData.services.unshift(service);
    return service;
  },

  async updateService(id: string, data: Partial<NewLawnService>) {
    await delay();
    const idx = allData.services.findIndex((s) => s._id === id);
    if (idx === -1) return null;
    allData.services[idx] = {
      ...allData.services[idx],
      ...data,
      updatedAt: now,
    };
    return allData.services[idx];
  },

  async deleteService(id: string) {
    await delay();
    const idx = allData.services.findIndex((s) => s._id === id);
    if (idx === -1) return false;
    allData.services.splice(idx, 1);
    return true;
  },

  async getLeads(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.leads];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, [
      'firstName',
      'lastName',
      'email',
      'phone',
      'city',
      'service',
    ]);
    return paginate(items, page, limit);
  },

  async getLeadById(id: string) {
    await delay();
    return allData.leads.find((l) => l._id === id) || null;
  },

  async createLead(data: Omit<NewLawnLead, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const lead: NewLawnLead = {
      _id: nextId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    allData.leads.unshift(lead);
    return lead;
  },

  async updateLead(id: string, data: Partial<NewLawnLead>) {
    await delay();
    const idx = allData.leads.findIndex((l) => l._id === id);
    if (idx === -1) return null;
    allData.leads[idx] = {
      ...allData.leads[idx],
      ...data,
      updatedAt: now,
    };
    return allData.leads[idx];
  },

  async deleteLead(id: string) {
    await delay();
    const idx = allData.leads.findIndex((l) => l._id === id);
    if (idx === -1) return false;
    allData.leads.splice(idx, 1);
    return true;
  },

  async getReviews(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.reviews];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['customerName', 'service', 'text']);
    return paginate(items, page, limit);
  },

  async createReview(data: Omit<NewLawnReview, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const review: NewLawnReview = {
      _id: nextId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    allData.reviews.unshift(review);
    return review;
  },

  async updateReview(id: string, data: Partial<NewLawnReview>) {
    await delay();
    const idx = allData.reviews.findIndex((r) => r._id === id);
    if (idx === -1) return null;
    allData.reviews[idx] = {
      ...allData.reviews[idx],
      ...data,
      updatedAt: now,
    };
    return allData.reviews[idx];
  },

  async deleteReview(id: string) {
    await delay();
    const idx = allData.reviews.findIndex((r) => r._id === id);
    if (idx === -1) return false;
    allData.reviews.splice(idx, 1);
    return true;
  },

  async getFAQs(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.faqs].sort((a, b) => a.order - b.order);
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['question', 'answer', 'category']);
    return paginate(items, page, limit);
  },

  async createFAQ(data: Omit<NewLawnFAQ, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const faq: NewLawnFAQ = {
      _id: nextId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    allData.faqs.push(faq);
    return faq;
  },

  async updateFAQ(id: string, data: Partial<NewLawnFAQ>) {
    await delay();
    const idx = allData.faqs.findIndex((f) => f._id === id);
    if (idx === -1) return null;
    allData.faqs[idx] = {
      ...allData.faqs[idx],
      ...data,
      updatedAt: now,
    };
    return allData.faqs[idx];
  },

  async deleteFAQ(id: string) {
    await delay();
    const idx = allData.faqs.findIndex((f) => f._id === id);
    if (idx === -1) return false;
    allData.faqs.splice(idx, 1);
    return true;
  },

  async getAreas(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.areas];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['name', 'region', 'description']);
    return paginate(items, page, limit);
  },

  async createArea(data: Omit<NewLawnArea, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const area: NewLawnArea = {
      _id: nextId(),
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    allData.areas.push(area);
    return area;
  },

  async updateArea(id: string, data: Partial<NewLawnArea>) {
    await delay();
    const idx = allData.areas.findIndex((a) => a._id === id);
    if (idx === -1) return null;
    allData.areas[idx] = {
      ...allData.areas[idx],
      ...data,
      updatedAt: now,
    };
    return allData.areas[idx];
  },

  async deleteArea(id: string) {
    await delay();
    const idx = allData.areas.findIndex((a) => a._id === id);
    if (idx === -1) return false;
    allData.areas.splice(idx, 1);
    return true;
  },

  // Gallery
  async getGallery(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.gallery];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['title', 'category']);
    return paginate(items, page, limit);
  },
  async createGalleryItem(data: Omit<NewLawnGalleryItem, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const item: NewLawnGalleryItem = { _id: nextId(), ...data, createdAt: now, updatedAt: now };
    allData.gallery.unshift(item);
    return item;
  },
  async updateGalleryItem(id: string, data: Partial<NewLawnGalleryItem>) {
    await delay();
    const idx = allData.gallery.findIndex((i) => i._id === id);
    if (idx === -1) return null;
    allData.gallery[idx] = { ...allData.gallery[idx], ...data, updatedAt: now };
    return allData.gallery[idx];
  },
  async deleteGalleryItem(id: string) {
    await delay();
    const idx = allData.gallery.findIndex((i) => i._id === id);
    if (idx === -1) return false;
    allData.gallery.splice(idx, 1);
    return true;
  },

  // Page Content
  async getPageContent(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.pageContent];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['title', 'page', 'section', 'content']);
    return paginate(items, page, limit);
  },
  async getPageContentById(id: string) {
    await delay();
    return allData.pageContent.find((p) => p._id === id) || null;
  },
  async createPageContent(data: Omit<NewLawnPageContent, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const item: NewLawnPageContent = { _id: nextId(), ...data, createdAt: now, updatedAt: now };
    allData.pageContent.unshift(item);
    return item;
  },
  async updatePageContent(id: string, data: Partial<NewLawnPageContent>) {
    await delay();
    const idx = allData.pageContent.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    allData.pageContent[idx] = { ...allData.pageContent[idx], ...data, updatedAt: now };
    return allData.pageContent[idx];
  },
  async deletePageContent(id: string) {
    await delay();
    const idx = allData.pageContent.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    allData.pageContent.splice(idx, 1);
    return true;
  },

  // Contact Info
  async getContactInfo(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.contactInfo].sort((a, b) => a.order - b.order);
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['label', 'value', 'type']);
    return paginate(items, page, limit);
  },
  async createContactInfo(data: Omit<NewLawnContactInfo, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const item: NewLawnContactInfo = { _id: nextId(), ...data, createdAt: now, updatedAt: now };
    allData.contactInfo.push(item);
    return item;
  },
  async updateContactInfo(id: string, data: Partial<NewLawnContactInfo>) {
    await delay();
    const idx = allData.contactInfo.findIndex((c) => c._id === id);
    if (idx === -1) return null;
    allData.contactInfo[idx] = { ...allData.contactInfo[idx], ...data, updatedAt: now };
    return allData.contactInfo[idx];
  },
  async deleteContactInfo(id: string) {
    await delay();
    const idx = allData.contactInfo.findIndex((c) => c._id === id);
    if (idx === -1) return false;
    allData.contactInfo.splice(idx, 1);
    return true;
  },

  // Team Members
  async getTeamMembers(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.teamMembers].sort((a, b) => a.order - b.order);
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['name', 'role', 'email']);
    return paginate(items, page, limit);
  },
  async getTeamMemberById(id: string) {
    await delay();
    return allData.teamMembers.find((t) => t._id === id) || null;
  },
  async createTeamMember(data: Omit<NewLawnTeamMember, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const item: NewLawnTeamMember = { _id: nextId(), ...data, createdAt: now, updatedAt: now };
    allData.teamMembers.push(item);
    return item;
  },
  async updateTeamMember(id: string, data: Partial<NewLawnTeamMember>) {
    await delay();
    const idx = allData.teamMembers.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    allData.teamMembers[idx] = { ...allData.teamMembers[idx], ...data, updatedAt: now };
    return allData.teamMembers[idx];
  },
  async deleteTeamMember(id: string) {
    await delay();
    const idx = allData.teamMembers.findIndex((t) => t._id === id);
    if (idx === -1) return false;
    allData.teamMembers.splice(idx, 1);
    return true;
  },

  // Promotions
  async getPromotions(params: NewLawnListParams = {}) {
    await delay();
    const { page = 1, limit = 10, search, status } = params;
    let items = [...allData.promotions];
    items = filterByStatus(items, status);
    items = filterBySearch(items, search, ['title', 'code', 'description']);
    return paginate(items, page, limit);
  },
  async getPromotionById(id: string) {
    await delay();
    return allData.promotions.find((p) => p._id === id) || null;
  },
  async createPromotion(data: Omit<NewLawnPromotion, '_id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const item: NewLawnPromotion = { _id: nextId(), ...data, createdAt: now, updatedAt: now };
    allData.promotions.unshift(item);
    return item;
  },
  async updatePromotion(id: string, data: Partial<NewLawnPromotion>) {
    await delay();
    const idx = allData.promotions.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    allData.promotions[idx] = { ...allData.promotions[idx], ...data, updatedAt: now };
    return allData.promotions[idx];
  },
  async deletePromotion(id: string) {
    await delay();
    const idx = allData.promotions.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    allData.promotions.splice(idx, 1);
    return true;
  },
};
