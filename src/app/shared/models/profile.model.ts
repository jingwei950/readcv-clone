// Profile-related models
export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
}

export interface ProfilePost {
  content: string;
  date: string;
  likes: number;
  comments: number;
}

export interface Profile {
  name?: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  coverImage?: string;
  status?: string;
  about?: string;
  links?: string[];
  experiences?: Experience[];
  projects?: Project[];
  education?: Education[];
  skills?: string[];
  posts?: ProfilePost[];
}
