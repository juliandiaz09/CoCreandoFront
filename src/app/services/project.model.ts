export interface Project {
    id: number;
    title: string;
    description: string;
    longDescription?: string;
    goal: number;
    collected: number;
    category: string;
    deadline: Date | string;
    location?: string;
    creator?: {
      name: string;
      email: string;
      bio: string;
      avatar: string;
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
}