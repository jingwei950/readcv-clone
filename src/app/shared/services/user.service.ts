import {
  doc,
  docData,
  Firestore,
  collection,
  DocumentReference,
} from '@angular/fire/firestore';
import { User as FirebaseUser } from '@angular/fire/auth';
import { User } from "@models/user.model"
import { AuthService } from './auth.service';
import { Observable, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DialogStateService } from './dialog-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Service
  firestore = inject(Firestore);
  authService = inject(AuthService);
  dialogService = inject(DialogStateService);

  // Variables
  currentUser = this.authService.auth_user;
  currentAuthUser$ = this.authService.auth_user$;

  // User collection
  userCollection = collection(this.firestore, 'users');

  doc?: DocumentReference;

  current_user$: Observable<User | null> = this.currentAuthUser$?.pipe(
    switchMap((auth_user: FirebaseUser | null) => {
      if (auth_user) {
        this.doc = doc(this.firestore, 'users', auth_user.uid);
        return (docData(this.doc) as Observable<User>).pipe(
          switchMap((user) => {
            if (user) {
              return of(user);
            } else {
              return of(null);
            }
          })
        );
      } else {
        return of(null);
      }
    })
  ) as Observable<User | null>;
  // current_user = toSignal(this.current_user$);

  // Create user
  addUser(user: User): void {
    // addDoc(this.userCollection, user).then((res) => res.id);
  }

  // Read user
  getUser() {}

  // Update user

  // Delete user
}
