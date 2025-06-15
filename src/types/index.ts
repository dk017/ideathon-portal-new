export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  skills: string[];
  avatar?: string;
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  stages: Stage[];
  maxParticipants?: number;
  currentParticipants: number;
  ideas: Idea[];
}

export interface Stage {
  id: string;
  name: string;
  description: string;
  order: number;
  deadline?: string;
}

export interface Idea {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  techStack: string[];
  owner: User;
  hackathonId: string;
  currentStage: number;
  isLongRunning: boolean;
  participants: User[];
  requirements: Requirement[];
  tasks: Task[];
  createdAt: string;
  joinRequests?: User[];
}

export interface Requirement {
  id: string;
  skill: string;
  description: string;
  isOpen: boolean;
  responses: RequirementResponse[];
}

export interface RequirementResponse {
  id: string;
  userId: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'participation_request' | 'requirement_response' | 'approval' | 'rejection';
  message: string;
  userId: string;
  relatedId: string;
  isRead: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  ideaId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
