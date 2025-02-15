import { Timestamp } from '@angular/fire/firestore';
import { User } from './user.model';

export interface Post {
  id: string;
  uid: string;
  content: string;
  likeCount: number;
  repostCount: number;
  commentCount: number;
  timestamp: Timestamp;
  contentImgUrl: string;
}

export interface EnrichedPost extends Post {
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  pronouns: string;
  bio: string;
  location: string;
  website: string;
  joinDate: Timestamp;
}
