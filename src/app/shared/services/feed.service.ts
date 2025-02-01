import { tap } from 'rxjs';
import {
  query,
  Firestore,
  collection,
  DocumentData,
  collectionData,
  collectionGroup,
  CollectionReference,
} from '@angular/fire/firestore';
import { Post } from '../models/post.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  // Services
  firestore = inject(Firestore);
  postCollection = collection(this.firestore, 'posts');
  // private afs = inject(AngularFirestore);

  // Variables
  allPosts = signal<Post[]>([]);

  // Get all posts
  private allPosts$ = collectionData<Post>(
    query<Post, DocumentData>(
      collectionGroup(this.firestore, 'posts') as CollectionReference<Post>
    ),
    { idField: 'id' }
  ).pipe(
    tap((posts) => {
      console.log(posts);
      this.allPosts.set(posts);
    })
  );

  private readonly posts = toSignal(this.allPosts$);

  // Get first layer collection
  // getPosts(): Observable<Post[]> {
  //   return collectionData(this.postCollection, {
  //     idField: 'id',
  //   }) as Observable<Post[]>;
  // }

  // Get all post (From the whole firebase with the collection/subcollection of ID "posts")
  // getAllPosts(): Observable<Post[]> {
  //   return collectionData<Post>(
  //     query<Post, DocumentData>(collectionGroup(this.firestore, 'posts') as CollectionReference<Post>),
  //     { idField: 'id' },
  //   );
  // }

  // constructor(private afs: AngularFirestore) {
  //   const subcollectionsRef = this.afs.collectionGroup('comments');
  //   subcollectionsRef.get().subscribe((snapshot) => {
  //     snapshot.docs.forEach((doc) => {
  //       const data = doc.data();
  //       console.log(data);
  //       // Use the data from each subcollection document
  //     });
  //   });
  // }

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
