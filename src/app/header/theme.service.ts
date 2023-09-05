import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = 'light';
  isDarkTheme: any;
  setDarkTheme: any;

  getTheme(): string {
    return this.currentTheme;
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    document.body.className = theme; // Apply the selected theme to the body element
  }
}
