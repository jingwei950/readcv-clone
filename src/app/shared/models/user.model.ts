import { Timestamp } from '@angular/fire/firestore';

export interface User {
  uid: string;
  name: string;
  username?: string;
  email: string;
  avatarUrl?: string;
  pronouns?: string;
  bio?: string;
  location?: string;
  joinDate: Timestamp;
}

export interface PostUser {
  name: string;
  username: string;
  avatar: string;
}
