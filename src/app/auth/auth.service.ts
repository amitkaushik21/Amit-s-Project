import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthData } from "./auth-data.model";
import { response } from "express";
import { Observable, BehaviorSubject, from } from 'rxjs';
import { Subject, of, lastValueFrom } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from "./firebase.config";
import { map, catchError, take } from 'rxjs/operators';
firebase.initializeApp(firebaseConfig);


@Injectable({ providedIn: "root" })
export class AuthService {
  private isAuthenticated = false;
   private token: string;
   private tokenTimer: any;
   private userId: string;   //create user model for name, email, etc info.
   private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router, private afAuth: AngularFireAuth) {

   }

   getToken() {
    return this.token;   // returning this as a function to get it in post.service too..
   }

   getIsAuth() {
    return this.isAuthenticated;
   }

   getUserId() {
    return this.userId;
   }

   getAuthStatusListener() {
    return this.authStatusListener.asObservable();
   }

    createUser(email: string, password: string) {
    const authData: AuthData = { email, password };
   return this.http.post("http://localhost:3000/api/user/signup/", authData).subscribe(() => {
   console.log("New User has been createdd!!")
   this.router.navigate(["/"]);
   }, error => {
    this.authStatusListener.next(false);
   }
   );

  }


  async googleSignIn(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      const credential = result.credential;
      const user = result.user;
      console.log('Google sign-in is successful');
      console.log(credential);

      // Check if the user already exists
      console.log('Checking if user exists...');
      const exists = await this.checkIfUserExists(user.uid);
      console.log('User exists:', exists);

      if (exists) {
        console.log("This user already exists!!!");
        // User already exists, do any additional actions here
      } else {
        // User doesn't exist, create a new user
        console.log("Creating a new user...");
        await this.createUser(user.uid, user.email);
        console.log("User created successfully");
      }

      // Redirect to the desired page after sign-in
      this.router.navigate(['/']);
    } catch (error) {
      // Handle sign-in error here
      console.log('Google sign-in error:', error);
    }
  }


  checkIfUserExists(uid: string): Promise<boolean> {
    console.log('Checking user existence for UID:', uid);
    return lastValueFrom(
      this.http
        .get<{ exists: boolean }>(`http://localhost:3000/api/user/checkIfUserExists/${uid}`)
        .pipe(
          take(1),
          map((res) => res.exists),
          catchError((error) => {
            console.log('Error checking user existence:', error);
            if (error.status === 404) {
              // User doesn't exist (assuming 404 status code indicates that)
              return of(false); // Return an observable using `of`
            }
            throw error; // Re-throw the error for further handling
          })
        )
    );
  }
/*
  createGoogleUser(user: firebase.User): Promise<any> {
    const authData: AuthData = { email: user.email, password: '' }; // Provide an empty password
    return this.http.post<AuthData>("http://localhost:3000/api/user/signup/", authData).toPromise();
  }
*/
/*  loginWithGoogle(user: firebase.User): void {
    const authData: AuthData = { email: user.email, password: '' }; // Provide an empty password
    this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login/", authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        console.error(error); // Log the error to the console for debugging
        this.authStatusListener.next(false);
      });
  }
*/


  login(email: string, password: string): void {
    const authData: AuthData = { email, password };
    this.http.post<{ token: string, expiresIn: number, userId: string }>("http://localhost:3000/api/user/login/", authData)
      .subscribe(response => {
        console.log(response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;   //for using userId for authorization
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      }, error => {
        console.error(error); // Log the error to the console for debugging
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
   const authInformation = this.getAuthData();
   if (!authInformation) {
    return;
   }
   const now = new Date();
   const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
   if(expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.userId = authInformation.userId;
    this.setAuthTimer(expiresIn / 1000);
    this.authStatusListener.next(true);
   }
  }



   logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
    console.log("The user has been logged out!");
   }

   private setAuthTimer(duration: number) {
    console.log("Setting Timer:" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);   //*1000 as it works in milliseconds so to convert to seconds 1000 is multiplied
   }

   private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("userId", userId);
   }

   private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
   }

   private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token && !expirationDate) {
      return;   //***** Warning: not all code paths return a value, corrected through tsgconfig.json>compileroptions>noimplicitreturns: false instead of true.
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
   }
  }
