import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './MyComponent/todos/todos.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { LoginComponent } from './auth/login/login.component';
import { FormsModule } from "@angular/forms";
import { SingupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { MatIconModule } from "@angular/material/icon";
import { FooterComponent } from './footer/footer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from './auth/firebase.config';
import { ErrorInterceptor } from './error-interceptor';
import { MatDialogModule } from "@angular/material/dialog";
import { ErrorComponent } from './error/error.component';
//import { GoogleLoginButtonComponent } from "./google-login-button/google-login-button";



/*const gapiClientConfig: NgGapiClientConfig = {
  client_id: '<YOUR_CLIENT_ID>',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  ux_mode: 'redirect',
  redirect_uri: 'http://localhost:4200/auth/google/callback',
  scope: [
    'profile',
    'email'
  ].join(' ')
};*/

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SingupComponent,
    FooterComponent,
    ErrorComponent


   // GoogleLoginButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatPaginatorModule,
    HttpClientModule,
    MatIconModule,
    MatProgressBarModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    MatDialogModule


  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],

  bootstrap: [AppComponent],
  entryComponents: [ ErrorComponent ]   //this informs angular that this is always going to be used even if angular cant see it.
})



export class AppModule { }
