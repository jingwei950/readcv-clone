import { doc, docData, Firestore, collection, DocumentReference, setDoc, Timestamp } from '@angular/fire/firestore';
import { User as FirebaseUser } from '@angular/fire/auth';
import { User } from '@models/user.model';
import { AuthService } from './auth.service';
import { Observable, of, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { DialogStateService } from './dialog-state.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Services
  firestore = inject(Firestore);
  authService = inject(AuthService);
  dialogService = inject(DialogStateService);

  // User collection
  userCollection = collection(this.firestore, 'users');

  // Document reference for the current user
  doc?: DocumentReference;

  // Current user data as Observable
  current_user$: Observable<User | null> = this.authService.auth_user$.pipe(
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
          }),
        );
      } else {
        return of(null);
      }
    }),
  );

  // Create user profile in Firestore when user registers
  async createUserProfile(authUser: FirebaseUser, displayName?: string, username?: string): Promise<void> {
    if (!authUser) return;

    // Reference to the user's document
    const userDocRef = doc(this.firestore, 'users', authUser.uid);

    // Create user object based on the User model
    const userData: User = {
      uid: authUser.uid,
      name: displayName || authUser.displayName || '',
      username: username || '',
      email: authUser.email || '',
      avatarUrl: authUser.photoURL || '', // Map photoURL to avatarUrl
      pronouns: '',
      bio: '',
      location: '',
      joinDate: Timestamp.now(),
    };

    // Save the user data to Firestore
    try {
      await setDoc(userDocRef, userData);
      console.log('User profile created successfully');
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  // Create user (keeping the old method for backward compatibility)
  addUser(user: User): void {
    const userDocRef = doc(this.firestore, 'users', user.uid);
    setDoc(userDocRef, user)
      .then(() => {
        console.log('User added successfully');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
      });
  }

  // Read user
  getUser(uid: string): Observable<User | null> {
    const userDocRef = doc(this.firestore, 'users', uid);
    return docData(userDocRef) as Observable<User>;
  }

  // Update user
  async updateUser(uid: string, userData: Partial<User>): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userDocRef, userData, { merge: true });
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(uid: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);
    try {
      await setDoc(userDocRef, { deleted: true }, { merge: true });
      console.log('User marked as deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}
