/**
 * UserReference represents a simplified user reference for tagging users
 * Used for associating users in various contexts like experiences and projects
 *
 * Properties:
 * - uid: Unique identifier for the user
 * - name: Display name of the user
 * - username: Username of the user for @mentions
 * - avatarUrl: Optional URL to the user's profile picture
 */
export interface UserReference {
  uid: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

/**
 * Experience model represents a professional work experience entry
 * Used for displaying job history in a user's portfolio
 *
 * Properties:
 * - from: The start date of the experience (required, e.g., "2021")
 * - to: The end date of the experience or "Now" for current positions (required)
 * - title: The job title or position held by the user (e.g., "Architect, painter")
 * - company: The name of the employer or organization (required, e.g., "Acme Inc.")
 * - location: Physical location where the work was performed (e.g., city, country)
 * - url: URL of the company website or related professional page
 * - coworkers: Array of users who worked with the user in this position
 * - description: Detailed information about responsibilities, achievements, and tasks
 * - attachments: Optional array of files or media attached to the experience entry
 */
export interface Experience {
  from: string;
  to: string;
  title?: string;
  company: string;
  location?: string;
  url?: string;
  coworkers?: UserReference[];
  description?: string;
  attachments?: { type: string; url: string; title?: string }[];
}

/**
 * ProjectYear represents valid years for a project
 * Can be any year from 1975 to the current year, or "Ongoing" for in-progress projects
 */
export type ProjectYear = string; // In implementation, this should be validated to be between "1975" and current year or "Ongoing"

/**
 * Project model represents a portfolio project
 * Used to showcase the user's work and capabilities
 *
 * Properties:
 * - title: The name of the project (required)
 * - year: The year when the project was completed (required, from 1975 to current year or "Ongoing")
 * - company: The company or client the project was for
 * - projectUrl: Link to the live project or demo
 * - collaborators: Array of users who collaborated on the project
 * - description: Detailed information about the project's purpose, features, and implementation
 * - attachments: Optional array of files or media attached to the project
 */
export interface Project {
  title: string;
  year: ProjectYear;
  company?: string;
  projectUrl?: string;
  collaborators?: UserReference[];
  description?: string;
  attachments?: { type: string; url: string; title?: string }[];
}

/**
 * Education model represents an educational qualification
 * Used for displaying academic background in a user's portfolio
 *
 * Properties:
 * - from: The start date of the education (required, e.g., "2020")
 * - to: The end date of the education or current if still studying (required, e.g., "2023")
 * - degree: The qualification or certification obtained (e.g., "Bachelor's Degree in Mobile & Web")
 * - institution: The name of the university, college, or educational organization (required, e.g., "Murdoch University")
 * - location: Physical location of the institution (e.g., "Wilkie Edge")
 * - url: URL of the institution website or related educational resource
 * - classmates: Array of users who studied with the user in this institution
 * - description: Detailed information about the education, courses, and achievements
 * - attachments: Optional array of files or media attached to the education entry
 */
export interface Education {
  from: string;
  to: string;
  degree: string;
  institution: string;
  location?: string;
  url?: string;
  classmates?: UserReference[];
  description?: string;
  attachments?: { type: string; url: string; title?: string }[];
}

/**
 * Portfolio model contains the user's professional information
 * Used to display detailed career information, projects, and content
 * Separate from basic profile to allow independent management
 *
 * Properties:
 * - uid: User ID that links the portfolio to a specific user
 * - coverImage: Optional URL for a header/cover image on the portfolio page
 * - about: Optional longer biography or professional summary
 * - links: Optional array of relevant external links (social media, GitHub, etc.)
 * - experiences: Optional array of work experiences from the Experience model
 * - projects: Optional array of portfolio projects from the Project model
 * - education: Optional array of educational qualifications from the Education model
 * - skills: Optional array of professional skills or competencies
 * - posts: Optional array of user posts from the ProfilePost model
 */
export interface Portfolio {
  uid: string;
  coverImage?: string;
  about?: string;
  links?: string[];
  experiences?: Experience[];
  projects?: Project[];
  education?: Education[];
  skills?: string[];
  posts?: string[]; // Reference to post IDs instead of embedding the full posts
}
