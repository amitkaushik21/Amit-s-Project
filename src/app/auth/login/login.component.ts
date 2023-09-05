import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Observable, Subscription } from "rxjs";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  template: `
    <button (click)="signIn()">Sign in with Google</button>
  `,
})

export class LoginComponent implements OnInit, OnDestroy{

   isLoading = false;
   private authStatusSub: Subscription;

   constructor(public authService: AuthService) {}

   ngOnInit() {
     this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
       authStatus =>{
         this.isLoading = false;
       }
     );

   }

onLogin(form: NgForm) {
   if(form.invalid) {
    return;
   }
   this.isLoading = true;
   this.authService.login(form.value.email, form.value.password);
}

ngOnDestroy() {
    this.authStatusSub.unsubscribe();
}

}

