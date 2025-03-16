import {
  Auth,
  user,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Injectable, effect, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public firestore = inject(Firestore);
  public auth = inject(Auth);

  auth_user$ = user(this.auth);
  auth_user = toSignal(this.auth_user$);
  provider = new GoogleAuthProvider();

  // Email link authentication result subject
  private emailLinkAuthResultSubject = new BehaviorSubject<UserCredential | null>(null);
  // Observable that components can subscribe to
  public emailLinkAuthResult$ = this.emailLinkAuthResultSubject.asObservable();

  actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:5173/',
    handleCodeInApp: true,
  };

  constructor() {
    effect(() => {
      if (!this.auth && isSignInWithEmailLink(this.auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        } else {
          signInWithEmailLink(this.auth, email, window.location.href)
            .then((result) => {
              window.localStorage.removeItem('emailForSignIn');
              // Emit the authentication result
              this.emailLinkAuthResultSubject.next(result);
              console.log('Email link authentication successful');
            })
            .catch((error) => {
              console.log(error);
              this.emailLinkAuthResultSubject.next(null);
              return;
            });
        }
      }
    });
  }

  logout() {
    // Logout
    signOut(this.auth);
    window.localStorage.removeItem('emailForSignIn');

    // TODO: Add route to main page
    window.location.reload();
  }

  // Email/password login or register
  async emailPasswordAuth(email: string, password: string, new_user?: boolean): Promise<UserCredential | null> {
    try {
      let userCredential: UserCredential;

      if (new_user) {
        userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      }
      console.log('Logged in successfully...');
      return userCredential;
    } catch (error: any) {
      console.error(error);
      this.errorHandling(error);
      return null;
    }
  }

  // Google login
  async googleAuth(): Promise<UserCredential | null> {
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      return result;
    } catch (error: any) {
      console.error(error);
      this.errorHandling(error);
      return null;
    }
  }

  // Check if user is new
  isNewUser(result: UserCredential): boolean {
    // @ts-ignore - additional user info is available but TypeScript doesn't know about it
    return !!result._tokenResponse?.isNewUser;
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
