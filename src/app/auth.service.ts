import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {  switchMap} from 'rxjs/operators';
import { User } from '../app/services/user';
import { FormControl, FormGroup } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  user: Observable<User[]>;
  

  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;
  newBooking: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
  public toastr: ToastrService) {
     this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
            // Logged in
          if (user) {
            return this.db.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            // Logged out
            return of(null);
          }
        })
     )
    ;
  }
  
  
  getUserState() {
    return this.afAuth.authState;
  }
  

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          this.router.navigate(['/register-student']);
          this.toastr.success("Welcome" + " " + userCredential.user.displayName + "!")
        }
      } )
  }

  createUser(user) {
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;

        userCredential.user.updateProfile({
          displayName: user.firstName + ' ' + user.lastName + ' ' + (user.role)
        });

        this.insertUserData(userCredential);
        this.router.navigate(['/login']);
        this.toastr.success("Welcome" + " " + userCredential.user.displayName+"!")
      })
      .catch(error => {
        this.eventAuthError.next(error);
    })
    
  }
  
  // For sign-up
  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      role: this.newUser.role

    })
  }
  
  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }
async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user)
      .then(() => {
        this.router.navigate(['/register-student']);
        this.toastr.success("Welcome" + " " + credential.user.displayName + "!")
      });
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`Users/${user.uid}`);

    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName, 
      photoURL: user.photoURL
    } 

    return userRef.set(data, { merge: true })

  }
  
}


