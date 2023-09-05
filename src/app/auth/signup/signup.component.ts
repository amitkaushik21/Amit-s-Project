import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})

 export class SingupComponent implements OnInit, OnDestroy{     //used @Inject to remove error
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

onSignup(form: NgForm) {
   if(form.invalid) {
    return;
   }

   this.isLoading = true;
   this.authService.createUser(form.value.email, form.value.password)
}

googleSignIn() {
  this.authService.googleSignIn();
}

ngOnDestroy() {
   this.authStatusSub.unsubscribe();
}

}

