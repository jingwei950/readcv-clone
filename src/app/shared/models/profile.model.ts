/**
 * ProfilePost model represents a post made by the user
 * Used to display content in a user's profile feed
 *
 * Properties:
 * - content: The text content of the post
 * - date: When the post was published, displayed in a user-friendly format
 * - likes: Number of likes or reactions the post has received
 * - comments: Number of comments on the post
 */
export interface ProfilePost {
  content: string;
  date: string;
  likes: number;
  comments: number;
}

/**
 * Profile model contains the user's basic profile information
 * Completely independent from User model, but references User via uid
 * Contains fields shown in the edit profile form that are specific to profiles
 * Note: avatarUrl, coverImage, bio, and links are maintained in the User model
 *
 * Properties:
 * - uid: Unique identifier that matches a User's uid in Firebase
 * - username: Unique identifier for the user (required, used in URLs and mentions)
 * - name: Display name shown on the profile (required, max 48 characters)
 * - occupation: Professional role or job title (optional, "What do you do?", max 32 characters)
 * - location: Geographic location of the user (optional, max 32 characters)
 * - pronouns: User's preferred pronouns (optional, max 12 characters)
 * - website: Link to the user's personal website or portfolio (optional, max 96 characters)
 */
export interface Profile {
  uid: string; // Reference to the User uid in Firebase
  occupation?: string; // "What do you do?" field (max 32 characters)
  website?: string; // Website field (max 96 characters)
}

/**
 * SocialConnections model represents the follower and following relationships
 * Used to display follower/following counts and manage social connections
 *
 * Properties:
 * - uid: Unique identifier that matches a User's uid in Firebase
 * - followerCount: Number of users who follow this profile
 * - followingCount: Number of users this profile follows
 * - followerIds: Array of user IDs who follow this profile
 * - followingIds: Array of user IDs this profile follows
 */
export interface SocialConnections {
  uid: string; // Reference to the User uid in Firebase
  followerCount: number;
  followingCount: number;
  followerIds: string[];
  followingIds: string[];
}

/**
 * EnrichedProfile extends the Profile model with user data and social connections
 * Used to display comprehensive profile information including social stats
 *
 * Properties:
 * - All Profile properties
 * - Social connection properties (followers/following)
 * - Posts and other user content
 */
export interface EnrichedProfileWithSocial extends Profile {
  // User fields that may come from User model
  email?: string;
  avatarUrl?: string;
  bio?: string;
  joinDate?: any;
  username?: string;
  name?: string;
  location?: string;
  pronouns?: string;

  // Social connections
  followerCount?: number;
  followingCount?: number;

  // Content
  posts?: any[]; // Array of user's posts
}
