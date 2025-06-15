import { Event, Idea, User, Stage, Requirement, Notification } from '@/types';

export const mockStages: Stage[] = [
  { id: 'stage-1', name: 'Ideation', description: 'Initial idea submission', order: 1 },
  { id: 'stage-2', name: 'Planning', description: 'Detailed planning and team formation', order: 2, deadline: '2024-07-01' },
  { id: 'stage-3', name: 'Development', description: 'Active development phase', order: 3, deadline: '2024-07-15' },
  { id: 'stage-4', name: 'Testing', description: 'Testing and refinement', order: 4, deadline: '2024-07-22' },
  { id: 'stage-5', name: 'Presentation', description: 'Final presentation preparation', order: 5, deadline: '2024-07-30' }
];

export const mockUsers: User[] = [
  { id: 'user-1', name: 'John Doe', email: 'john@example.com', role: 'user', skills: ['React', 'TypeScript', 'Node.js'] },
  { id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', skills: ['Python', 'Machine Learning', 'Data Science'] },
  { id: 'user-3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', skills: ['UI/UX', 'Figma', 'Design Systems'] },
  { id: 'user-4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'user', skills: ['Backend', 'Database', 'AWS'] },
  { id: 'admin-1', name: 'Admin User', email: 'admin@example.com', role: 'admin', skills: ['Management', 'Strategy'] }
];

export const mockEvents: Event[] = [
  {
    id: 'hack-1',
    name: 'AI Innovation Challenge 2024',
    description: 'Build the next generation of AI-powered applications',
    startDate: '2024-06-15',
    endDate: '2024-07-30',
    status: 'active',
    stages: mockStages,
    maxParticipants: 100,
    currentParticipants: 42,
    ideas: [],
    category: ''
  },
  {
    id: 'hack-2',
    name: 'Sustainability Tech Hackathon',
    description: 'Create technology solutions for environmental challenges',
    startDate: '2024-08-01',
    endDate: '2024-09-15',
    status: 'upcoming',
    stages: mockStages,
    maxParticipants: 80,
    currentParticipants: 15,
    ideas: [],
    category: ''
  },
  {
    id: 'hack-3',
    name: 'FinTech Revolution',
    description: 'Revolutionize financial services with innovative solutions',
    startDate: '2024-04-01',
    endDate: '2024-05-30',
    status: 'completed',
    stages: mockStages,
    maxParticipants: 60,
    currentParticipants: 58,
    ideas: [],
    category: ''
  }
];

export const mockRequirements: Requirement[] = [
  {
    id: 'req-1',
    skill: 'Frontend Developer',
    description: 'Looking for a React expert to help with UI components',
    isOpen: true,
    responses: []
  },
  {
    id: 'req-2',
    skill: 'Data Scientist',
    description: 'Need someone with ML experience for data analysis',
    isOpen: true,
    responses: []
  }
];

export const mockIdeas: Idea[] = [
  {
    id: 'idea-1',
    referenceNumber: 'AI-2024-001',
    title: 'Smart City Traffic Optimizer',
    description: 'AI-powered system to optimize traffic flow in urban areas using real-time data',
    techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
    owner: mockUsers[0],
    eventId: 'hack-1',
    currentStage: 2,
    isLongRunning: false,
    participants: [mockUsers[0], mockUsers[1]],
    requirements: [mockRequirements[0]],
    createdAt: '2024-06-16T10:00:00Z',
    tasks: []
  },
  {
    id: 'idea-2',
    referenceNumber: 'AI-2024-002',
    title: 'Healthcare Chatbot Assistant',
    description: 'Intelligent chatbot to provide preliminary health advice and appointment scheduling',
    techStack: ['Python', 'NLP', 'React Native', 'Firebase'],
    owner: mockUsers[1],
    eventId: 'hack-1',
    currentStage: 3,
    isLongRunning: false,
    participants: [mockUsers[1], mockUsers[2], mockUsers[3]],
    requirements: [],
    createdAt: '2024-06-17T14:30:00Z',
    tasks: []
  },
  {
    id: 'idea-3',
    referenceNumber: 'SUST-2024-001',
    title: 'Carbon Footprint Tracker',
    description: 'Mobile app to track and reduce personal carbon footprint with gamification',
    techStack: ['React Native', 'Node.js', 'MongoDB'],
    owner: mockUsers[2],
    eventId: 'hack-2',
    currentStage: 1,
    isLongRunning: true,
    participants: [mockUsers[2]],
    requirements: [mockRequirements[1]],
    createdAt: '2024-06-20T09:15:00Z',
    tasks: []
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'participation_request',
    message: 'Mike Johnson wants to join your idea "Smart City Traffic Optimizer"',
    userId: 'user-1',
    relatedId: 'idea-1',
    isRead: false,
    createdAt: '2024-06-21T10:30:00Z'
  },
  {
    id: 'notif-2',
    type: 'requirement_response',
    message: 'New response to your Frontend Developer requirement',
    userId: 'user-1',
    relatedId: 'req-1',
    isRead: false,
    createdAt: '2024-06-21T15:45:00Z'
  }
];
