import { Timestamp } from "@angular/fire/firestore"

export interface Post {
  id: string;
  name: string;
  username: string;
  avatar: string;
  timestamp: Timestamp;
  content: string;
  contentImgUrl: string;
  commentCount: number;
  repostCount: number;
  likeCount: number;
}
