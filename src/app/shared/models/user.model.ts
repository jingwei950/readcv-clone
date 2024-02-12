import { Timestamp } from '@angular/fire/firestore';

export interface user {
  uid: string;
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
