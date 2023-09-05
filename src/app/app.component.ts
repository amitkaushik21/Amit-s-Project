import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

declare const gapi: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {

  }
}
