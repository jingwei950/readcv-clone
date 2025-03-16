import { Injectable, inject } from '@angular/core';
import {
  doc,
  docData,
  Firestore,
  collection,
  setDoc,
  query,
  where,
  getDocs,
  collectionData,
  Transaction,
  runTransaction,
} from '@angular/fire/firestore';
import { Observable, of, map, switchMap, catchError, combineLatest } from 'rxjs';
import { Profile, SocialConnections } from '@models/profile.model';
import { User } from '@models/user.model';
import { UserService } from './user.service';

/**
 * Combined User and Profile data
 * This type merges fields from both User and Profile models
 * Fields with the same name in both models (like name, username) will use Profile's version
 */
export interface EnrichedProfile {
  // User fields
  uid: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: any;
  username?: string;
  name?: string;
  location?: string;
  pronouns?: string;

  // Profile fields
  occupation?: string;
  website?: string;

  // Social connection fields
  followerCount?: number;
  followingCount?: number;

  // Posts
  posts?: any[]; // Array of user's posts
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  // Services
  firestore = inject(Firestore);
  userService = inject(UserService);

  // Profile collection
  profileCollection = collection(this.firestore, 'profiles');

  // Posts collection
  postsCollection = collection(this.firestore, 'posts');

  /**
   * Get a profile by uid
   * @param uid User ID
   * @returns Observable of Profile or null
   */
  getProfileByUid(uid: string): Observable<Profile | null> {
    if (!uid) return of(null);

    const profileDocRef = doc(this.firestore, 'profiles', uid);
    return docData(profileDocRef).pipe(
      map((data) => data as Profile),
      catchError((error) => {
        console.error('Error fetching profile:', error);
        return of(null);
      }),
    );
  }

  /**
   * Get posts by user ID
   * @param uid User ID
   * @returns Observable of posts array or empty array
   */
  getPostsByUserId(uid: string): Observable<any[]> {
    if (!uid) return of([]);

    const postsQuery = query(this.postsCollection, where('uid', '==', uid));

    return collectionData(postsQuery, { idField: 'id' }).pipe(
      catchError((error) => {
        console.error('Error fetching user posts:', error);
        return of([]);
      }),
    );
  }

  /**
   * Get an enriched profile combining User and Profile data
   * @param uid User ID
   * @returns Observable of EnrichedProfile or null
   */
  getEnrichedProfileByUid(uid: string): Observable<EnrichedProfile | null> {
    if (!uid) return of(null);

    const userObs = this.userService.getUser(uid);
    const profileObs = this.getProfileByUid(uid);
    const postsObs = this.getPostsByUserId(uid);
    const socialObs = this.getSocialConnectionsByUid(uid);

    return combineLatest([userObs, profileObs, postsObs, socialObs]).pipe(
      map(([user, profile, posts, social]) => {
        if (!user || !profile) return null;

        // Create a complete enriched profile by combining user and profile data
        const enrichedProfile: EnrichedProfile = {
          ...user,
          ...profile,
          ...social,
          posts: posts || [],
        };

        return enrichedProfile;
      }),
      catchError((error) => {
        console.error('Error fetching enriched profile:', error);
        return of(null);
      }),
    );
  }

  /**
   * Create or update a profile
   * @param profile Profile data to save
   * @returns Promise that resolves when the operation completes
   */
  async saveProfile(profile: Profile): Promise<void> {
    if (!profile.uid) {
      console.error('Cannot save profile without uid');
      return;
    }

    const profileDocRef = doc(this.firestore, 'profiles', profile.uid);

    try {
      await setDoc(profileDocRef, profile);
      console.log('Profile saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Create initial profile from user data
   * @param user User data to create profile from
   * @returns Promise that resolves when the operation completes
   */
  async createProfileFromUser(user: User): Promise<void> {
    if (!user.uid) {
      console.error('Cannot create profile without user uid');
      return;
    }

    // Create a new profile based on user data, only including Profile fields
    const profile: Profile = {
      uid: user.uid,
      // Set optional fields to empty strings if they don't exist
      occupation: '',
      website: '',
    };

    await this.saveProfile(profile);
  }

  /**
   * Create a profile document in the profiles collection for a new user
   * @param user Firebase user object or User model
   * @param defaultName Optional default name for the profile (defaults to email username)
   * @returns Promise that resolves when the profile is created
   */
  async createNewUserProfile(user: any, defaultName?: string): Promise<void> {
    try {
      // Ensure we have the required uid
      const uid = user.uid;
      if (!uid) {
        console.error('Cannot create profile without user uid');
        throw new Error('Missing user uid');
      }

      // Get email - could be from Firebase user or from our User model
      const email = user.email || '';
      if (!email) {
        console.warn('Creating profile with no email');
      }

      // Create a profile object according to the updated model
      // Only include fields that are part of the Profile model
      const profile: Profile = {
        uid,
        // Initialize optional fields with empty values
        occupation: '',
        website: '',
      };

      // Save the profile to Firestore
      const profileDocRef = doc(this.firestore, 'profiles', uid);
      await setDoc(profileDocRef, profile);

      // Also initialize social connections for the new user
      await this.createNewUserSocialConnections(uid);

      console.log('New user profile created successfully');
      return;
    } catch (error) {
      console.error('Error creating new user profile:', error);
      throw error;
    }
  }

  /**
   * Create initial social connections document for a new user
   * @param uid User ID
   * @returns Promise that resolves when the operation completes
   */
  async createNewUserSocialConnections(uid: string): Promise<void> {
    if (!uid) {
      console.error('Cannot create social connections without uid');
      return;
    }

    try {
      // Create a new social connections object with default values
      const socialConnections: SocialConnections = {
        uid,
        followerCount: 0,
        followingCount: 0,
        followerIds: [],
        followingIds: [],
      };

      // Save the social connections to Firestore
      const socialDocRef = doc(this.firestore, 'social_connections', uid);
      await setDoc(socialDocRef, socialConnections);

      console.log('Social connections initialized successfully for user:', uid);
    } catch (error) {
      console.error('Error creating social connections:', error);
      throw error;
    }
  }

  /**
   * Get current user's profile
   * @returns Observable of Profile or null
   */
  getCurrentUserProfile(): Observable<Profile | null> {
    return this.userService.current_user$.pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return this.getProfileByUid(user.uid);
      }),
    );
  }

  /**
   * Get current user's enriched profile (combined User and Profile data)
   * @returns Observable of EnrichedProfile or null
   */
  getCurrentEnrichedProfile(): Observable<EnrichedProfile | null> {
    return this.userService.current_user$.pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return this.getEnrichedProfileByUid(user.uid);
      }),
    );
  }

  /**
   * Get a user by username
   * @param username Username to search for
   * @returns Observable of User or null
   */
  getUserByUsername(username: string): Observable<User | null> {
    if (!username) return of(null);

    const usersCollection = collection(this.firestore, 'users');
    const usersQuery = query(usersCollection, where('username', '==', username));

    return collectionData(usersQuery, { idField: 'id' }).pipe(
      map((users) => (users.length > 0 ? (users[0] as User) : null)),
      catchError((error) => {
        console.error('Error fetching user by username:', error);
        return of(null);
      }),
    );
  }

  /**
   * Get profile by username
   * @param username Username to search for
   * @returns Observable of Profile or null
   */
  getProfileByUsername(username: string): Observable<Profile | null> {
    if (!username) return of(null);

    return this.getUserByUsername(username).pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return this.getProfileByUid(user.uid);
      }),
    );
  }

  /**
   * Get enriched profile by username
   * @param username Username to search for
   * @returns Observable of EnrichedProfile or null
   */
  getEnrichedProfileByUsername(username: string): Observable<EnrichedProfile | null> {
    if (!username) return of(null);

    return this.getUserByUsername(username).pipe(
      switchMap((user) => {
        if (!user) return of(null);
        return this.getEnrichedProfileByUid(user.uid);
      }),
    );
  }

  /**
   * Get social connections for a user
   * @param uid User ID
   * @returns Observable of SocialConnections or default values
   */
  getSocialConnectionsByUid(uid: string): Observable<SocialConnections | null> {
    if (!uid) return of(null);

    const socialDocRef = doc(this.firestore, 'social_connections', uid);
    return docData(socialDocRef).pipe(
      map((data) => data as SocialConnections),
      catchError((error) => {
        console.error('Error fetching social connections:', error);
        // Return default values if document doesn't exist
        return of({
          uid,
          followerCount: 0,
          followingCount: 0,
          followerIds: [],
          followingIds: [],
        });
      }),
    );
  }

  /**
   * Follow a user
   * @param currentUserId ID of the current user doing the following
   * @param targetUserId ID of the user to follow
   * @returns Promise that resolves when the operation completes
   */
  async followUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (!currentUserId || !targetUserId) {
      console.error('Missing user IDs for follow operation');
      return;
    }

    // Get the current user's social connections
    const currentUserSocialRef = doc(this.firestore, 'social_connections', currentUserId);
    // Get the target user's social connections
    const targetUserSocialRef = doc(this.firestore, 'social_connections', targetUserId);

    try {
      // Start a Firestore transaction to ensure data consistency
      await runTransaction(this.firestore, async (transaction: Transaction) => {
        // Get current social connection documents
        const currentUserSocialDoc = await transaction.get(currentUserSocialRef);
        const targetUserSocialDoc = await transaction.get(targetUserSocialRef);

        // If documents don't exist, create them with default values
        const currentUserSocial: SocialConnections = currentUserSocialDoc.exists()
          ? (currentUserSocialDoc.data() as SocialConnections)
          : {
              uid: currentUserId,
              followerCount: 0,
              followingCount: 0,
              followerIds: [],
              followingIds: [],
            };

        const targetUserSocial: SocialConnections = targetUserSocialDoc.exists()
          ? (targetUserSocialDoc.data() as SocialConnections)
          : {
              uid: targetUserId,
              followerCount: 0,
              followingCount: 0,
              followerIds: [],
              followingIds: [],
            };

        // Check if already following to avoid duplicates
        if (!currentUserSocial.followingIds.includes(targetUserId)) {
          // Update current user's following list
          currentUserSocial.followingIds.push(targetUserId);
          currentUserSocial.followingCount++;

          // Update target user's followers list
          targetUserSocial.followerIds.push(currentUserId);
          targetUserSocial.followerCount++;

          // Write back to Firestore
          transaction.set(currentUserSocialRef, currentUserSocial);
          transaction.set(targetUserSocialRef, targetUserSocial);
        }
      });

      console.log(`User ${currentUserId} now following ${targetUserId}`);
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  /**
   * Unfollow a user
   * @param currentUserId ID of the current user doing the unfollowing
   * @param targetUserId ID of the user to unfollow
   * @returns Promise that resolves when the operation completes
   */
  async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
    if (!currentUserId || !targetUserId) {
      console.error('Missing user IDs for unfollow operation');
      return;
    }

    // Get the current user's social connections
    const currentUserSocialRef = doc(this.firestore, 'social_connections', currentUserId);
    // Get the target user's social connections
    const targetUserSocialRef = doc(this.firestore, 'social_connections', targetUserId);

    try {
      // Start a Firestore transaction to ensure data consistency
      await runTransaction(this.firestore, async (transaction: Transaction) => {
        // Get current social connection documents
        const currentUserSocialDoc = await transaction.get(currentUserSocialRef);
        const targetUserSocialDoc = await transaction.get(targetUserSocialRef);

        // If documents don't exist, nothing to do
        if (!currentUserSocialDoc.exists() || !targetUserSocialDoc.exists()) {
          return;
        }

        const currentUserSocial: SocialConnections = currentUserSocialDoc.data() as SocialConnections;
        const targetUserSocial: SocialConnections = targetUserSocialDoc.data() as SocialConnections;

        // Check if following relationship exists
        const currentUserFollowingIndex = currentUserSocial.followingIds.indexOf(targetUserId);
        const targetUserFollowerIndex = targetUserSocial.followerIds.indexOf(currentUserId);

        // Remove relationship if it exists
        if (currentUserFollowingIndex !== -1) {
          // Update current user's following list
          currentUserSocial.followingIds.splice(currentUserFollowingIndex, 1);
          currentUserSocial.followingCount = Math.max(0, currentUserSocial.followingCount - 1);

          // Write back to Firestore
          transaction.set(currentUserSocialRef, currentUserSocial);
        }

        if (targetUserFollowerIndex !== -1) {
          // Update target user's followers list
          targetUserSocial.followerIds.splice(targetUserFollowerIndex, 1);
          targetUserSocial.followerCount = Math.max(0, targetUserSocial.followerCount - 1);

          // Write back to Firestore
          transaction.set(targetUserSocialRef, targetUserSocial);
        }
      });

      console.log(`User ${currentUserId} unfollowed ${targetUserId}`);
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  /**
   * Check if a user is following another user
   * @param currentUserId ID of the current user
   * @param targetUserId ID of the target user
   * @returns Observable boolean indicating if the current user follows the target user
   */
  isFollowing(currentUserId: string, targetUserId: string): Observable<boolean> {
    if (!currentUserId || !targetUserId) {
      return of(false);
    }

    return this.getSocialConnectionsByUid(currentUserId).pipe(
      map((social) => {
        if (!social) return false;
        return social.followingIds.includes(targetUserId);
      }),
    );
  }

  /**
   * Ensure a user has a social connections document
   * This can be used for existing users to make sure they have social connections
   * If connections already exist, it won't overwrite them
   *
   * @param uid User ID to ensure social connections for
   * @returns Promise that resolves when the operation completes
   */
  async ensureUserSocialConnections(uid: string): Promise<void> {
    if (!uid) {
      console.error('Cannot ensure social connections without uid');
      return;
    }

    try {
      const socialDocRef = doc(this.firestore, 'social_connections', uid);
      const socialDoc = await getDocs(query(collection(this.firestore, 'social_connections'), where('uid', '==', uid)));

      // Only create if it doesn't exist
      if (socialDoc.empty) {
        await this.createNewUserSocialConnections(uid);
      }
    } catch (error) {
      console.error('Error ensuring social connections:', error);
      throw error;
    }
  }

  /**
   * Initialize social connections for all users in the system
   * This is a utility method that can be used to batch process all users
   * and ensure they all have social connections documents
   *
   * @returns Promise that resolves when the operation completes
   */
  async initializeAllUserSocialConnections(): Promise<void> {
    try {
      // Get all profiles
      const profilesSnapshot = await getDocs(this.profileCollection);

      // For each profile, ensure social connections exist
      const promises = profilesSnapshot.docs.map((doc) => {
        const profile = doc.data() as Profile;
        return this.ensureUserSocialConnections(profile.uid);
      });

      // Wait for all operations to complete
      await Promise.all(promises);

      console.log(`Initialized social connections for ${promises.length} users`);
    } catch (error) {
      console.error('Error initializing all user social connections:', error);
      throw error;
    }
  }

  /**
   * Get followers for a specified user
   * Returns an array of EnrichedProfile objects for all followers
   *
   * @param uid User ID to get followers for
   * @returns Observable of array of EnrichedProfile objects
   */
  getFollowers(uid: string): Observable<EnrichedProfile[]> {
    if (!uid) return of([]);

    return this.getSocialConnectionsByUid(uid).pipe(
      switchMap((socialConnections) => {
        if (!socialConnections || !socialConnections.followerIds || socialConnections.followerIds.length === 0) {
          return of([]);
        }

        // Get enriched profiles for each follower
        const followerProfiles$ = socialConnections.followerIds.map((followerId) =>
          this.getEnrichedProfileByUid(followerId),
        );

        return combineLatest(followerProfiles$).pipe(
          map((profiles) => profiles.filter((profile) => profile !== null) as EnrichedProfile[]),
        );
      }),
      catchError((error) => {
        console.error('Error fetching followers:', error);
        return of([]);
      }),
    );
  }

  /**
   * Get following users for a specified user
   * Returns an array of EnrichedProfile objects for all users the specified user follows
   *
   * @param uid User ID to get following for
   * @returns Observable of array of EnrichedProfile objects
   */
  getFollowing(uid: string): Observable<EnrichedProfile[]> {
    if (!uid) return of([]);

    return this.getSocialConnectionsByUid(uid).pipe(
      switchMap((socialConnections) => {
        if (!socialConnections || !socialConnections.followingIds || socialConnections.followingIds.length === 0) {
          return of([]);
        }

        // Get enriched profiles for each following user
        const followingProfiles$ = socialConnections.followingIds.map((followingId) =>
          this.getEnrichedProfileByUid(followingId),
        );

        return combineLatest(followingProfiles$).pipe(
          map((profiles) => profiles.filter((profile) => profile !== null) as EnrichedProfile[]),
        );
      }),
      catchError((error) => {
        console.error('Error fetching following users:', error);
        return of([]);
      }),
    );
  }
}
