import { combineLatest, map, Observable, of, switchMap, take, tap } from 'rxjs';
import {
  query,
  where,
  Firestore,
  collection,
  DocumentData,
  collectionData,
  collectionGroup,
  CollectionReference,
} from '@angular/fire/firestore';
import { EnrichedPost, Post } from '../models/post.model';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  // Services
  firestore = inject(Firestore);
  postCollection = collection(this.firestore, 'posts');

  // Get all posts
  allPosts$ = collectionData<Post>(
    query<Post, DocumentData>(collectionGroup(this.firestore, 'posts') as CollectionReference<Post>),
    { idField: 'id' },
  );

  private allPostsCollection = collection(this.firestore, 'all_posts') as CollectionReference<Post>;
  private highlightPostsCollection = collection(this.firestore, 'highlight_posts') as CollectionReference<Post>;
  private userCollection = collection(this.firestore, 'users');

  getAllPosts$ = collectionData(this.allPostsCollection, { idField: 'id' }) as Observable<Post[]>;
  getHighlightPosts$ = collectionData(this.highlightPostsCollection, { idField: 'id' }) as Observable<Post[]>;

  userEnrichedPost$ = collectionData(this.allPostsCollection, { idField: 'id' }).pipe(
    switchMap((posts) => {
      if (posts.length === 0) return of([]); // Return empty array if no posts

      const postsWithUsers$ = posts.map((post) =>
        this.getUser(post.uid).pipe(
          map((user) => ({ ...post, ...user }) as EnrichedPost), // Type assertion
        ),
      );

      return combineLatest(postsWithUsers$);
    }),
    tap((post) => console.log(post)),
    take(1),
  ) as Observable<EnrichedPost[]>;

  getUser(uid: string) {
    return collectionData(query(this.userCollection, where('uid', '==', uid))).pipe(map(([user]) => user));
  }

  addPost() {
    // Add user post to firebase
  }

  highlightFeed: Post[] = [
    // {
    //   id: '1',
    //   name: 'Ana Malai',
    //   username: 'anainsonmnia',
    //   avatar: '',
    //   timestamp: '1d',
    //   content: '🥹💙🌞',
    //   contentImgUrl:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_limit,h_573,w_430/dpr_1.0/v1/1/users/QA9uvKJUjGWlvvuPjytuaSDugy53/post-1176302f-20a3-4c0d-8618-9da4ef3c8304.jpg?_a=ATO2BAA0',
    //   commentCount: 0,
    //   repostCount: 0,
    //   likeCount: 0,
    // },
    // {
    //   id: '2',
    //   name: 'Ria',
    //   username: 'ria',
    //   avatar:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_fill,h_48,w_48/dpr_1.0/v1/1/profilePhotos/b04QGGQmC3Ywkgc41lNygLDx7uu2/e59828d6-048f-4df9-b685-c3cb1cb001ea.jpg?_a=ATO2BAA0',
    //   timestamp: '1h',
    //   content: 'Seattle sunset',
    //   contentImgUrl:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_limit,h_287,w_430/dpr_1.0/v1/1/users/b04QGGQmC3Ywkgc41lNygLDx7uu2/post-a9d6d8c6-966d-4dad-8e7f-1383f153e3ee.jpg?_a=ATO2BAA0',
    //   commentCount: 5,
    //   repostCount: 0,
    //   likeCount: 5,
    // },
    // {
    //   id: '3',
    //   name: 'Derek J',
    //   username: 'derekj',
    //   avatar:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_fill,h_48,w_48/dpr_1.0/v1/1/profilePhotos/VPdFM3iLQSPk1s8SvzCbqoktYyn2/5e73638d-6dcc-451d-91e8-bc7db9bf1fa2.jpg?_a=ATO2BAA0',
    //   timestamp: '2h',
    //   content: 'The evening gradient of nature 🌙',
    //   contentImgUrl:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_limit,h_312,w_430/dpr_1.0/v1/1/users/VPdFM3iLQSPk1s8SvzCbqoktYyn2/post-eafd7ac2-382c-4d82-86a4-9a55beb0cbff.jpg?_a=ATO2BAA0',
    //   commentCount: 0,
    //   repostCount: 0,
    //   likeCount: 0,
    // },
    // {
    //   id: '4',
    //   name: 'Rahul Agarwal',
    //   username: 'edz',
    //   avatar:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_fill,h_48,w_48/dpr_1.0/v1/1/profilePhotos/HcjRS5SFTUb6nGErABpGWCNwpfg1/7c9a504c-502e-4062-88e0-3dac2c6c51f7.jpg?_a=ATO2BAA0',
    //   timestamp: '13h',
    //   content: '新年好 • Happy Lunar New Year 🧧',
    //   contentImgUrl:
    //     'https://res.cloudinary.com/read-cv/image/upload/c_limit,h_537,w_430/dpr_1.0/v1/1/users/HcjRS5SFTUb6nGErABpGWCNwpfg1/post-46a30ab7-4efe-4bd2-8137-684c7a424208.jpg?_a=ATO2BAA0',
    //   commentCount: 0,
    //   repostCount: 0,
    //   likeCount: 31,
    // },
  ];
}
