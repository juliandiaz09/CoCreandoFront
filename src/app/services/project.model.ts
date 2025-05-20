export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    goal: number;
    collected: number;
    category: string;
    deadline: Date | string;
    location?: string;
    creator?: {
      id: string;
      name: string;
      email: string;
      bio?: string;
      avatar?: string;
    };
    risksAndChallenges?: string;
    rewards?: {
      title: string;
      description: string;
      minimumAmount: number;
    }[];
    updates?: {
      date: Date | string;
      title: string;
      content: string;
    }[];
    supporters?: {
      name: string;
      amount: number;
      date: Date | string;
    }[];
    status?: string; // Nuevo campo para el estado
}