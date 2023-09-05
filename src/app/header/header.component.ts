import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { Observable } from 'rxjs';
import { ThemePalette } from '@angular/material/core';

import { Router, NavigationEnd } from '@angular/router';
//import { ThemeService } from "./theme.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {


  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService,
    private router: Router) {
    }

  isLinkActive(path: string): boolean {
    return this.router.url === path;
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
   this.authListenerSubs = this.authService
   .getAuthStatusListener()
   .subscribe(isAuthenticated => {
     this.userIsAuthenticated = isAuthenticated;
   });
  }

  // Method to toggle the theme
 /* toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
    this.currentTheme = newTheme;
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
  }
*/
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
