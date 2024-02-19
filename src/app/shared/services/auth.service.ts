// Angular imports
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

// Firebase
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  User,
  user,
} from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Credentials } from '../models/credential.model';
import { defer, from } from 'rxjs';

// export type AuthUser = User | null | undefined;

// interface AuthState {
//   user: AuthUser;
// }

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public firestore = inject(Firestore);
  public auth = inject(Auth);
  private user$ = authState(this.auth); //Might delete

  // State
  // private state = signal<AuthState>({
  //   user: undefined,
  // });

  // Selectors
  // user = computed(() => this.state().user);

  auth_user$ = user(this.auth);
  auth_user = toSignal(this.auth_user$);
  provider = new GoogleAuthProvider();
  userCurrentURL = signal('');

  actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:5173/',
    // This must be true.
    handleCodeInApp: true,
  };

  constructor() {
    effect(() => {
      console.log(this.auth_user());
      // console.log(window.localStorage.getItem('emailForSignIn'));
    });
    // this.user$.subscribe((user) => console.log(user));
    //
    // this.user$.pipe(takeUntilDestroyed()).subscribe((user) =>
    //   this.state.update((state) => ({
    //     ...state,
    //     user,
    //   })),
    // );

    // if (isSignInWithEmailLink(this.auth, window.location.href)) {
    //   let email: string | null = window.localStorage.getItem('emailForSignIn');
    //   console.log(email);
    //   if (!email) {
    //     email = window.prompt('Please provide your email for confirmation');
    //   } else if (email) {
    //     signInWithEmailLink(this.auth, email, window.location.href)
    //       .then((result) => {
    //         // Clear email from storage.
    //         window.localStorage.removeItem('emailForSignIn');
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //   }
    // }
  }

  // Test login
  // login(credentials: Credentials) {
  //   return from(defer(() => signInWithEmailAndPassword(this.auth, credentials.email, credentials.password)));
  // }

  logout() {
    // Logout
    signOut(this.auth);

    // TODO: Add route to main page
    window.location.reload();
  }

  // createAccount(credentials: Credentials) {
  //   return from(defer(() => createUserWithEmailAndPassword(this.auth, credentials.email, credentials.password)));
  // }

  // RVI login
  async emailPasswordAuth(email: string, password: string, new_user?: boolean) {
    try {
      if (new_user) {
        await createUserWithEmailAndPassword(this.auth, email, password);
      } else {
        await signInWithEmailAndPassword(this.auth, email, password);
      }
      console.log('Logged in successfully...');
    } catch (error: any) {
      console.error(error);
      this.errorHandling(error);
    }
  }

  async googleAuth() {
    try {
      await signInWithPopup(this.auth, this.provider);
    } catch (error: any) {
      console.error(error);
      this.errorHandling(error);
    }
  }

  async sendEmailLinkAuth(email: string) {
    await sendSignInLinkToEmail(this.auth, email, this.actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  errorHandling(error: any) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        alert('😅 There is an account with that email. Jump back in...');
        break;
      case 'auth/user-not-found':
        alert('🤷 User not found... \n\nIf you are new to RVI, create an account 😊.');
        break;
      case 'auth/missing-email':
        alert('🤷 Email does not exist...');
        break;
      case 'auth/invalid-email':
        alert('🤷  Email does not exist... \n\nIf you are new to RVI, create an account 😊.');
        break;
      case 'auth/wrong-password':
        alert('🧐 Check your email and password again...');
        break;
    }
  }
}
