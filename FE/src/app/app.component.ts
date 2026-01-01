import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatIcon, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project-management';
  showMenu: boolean = false;

   toggleMenu() {
    console.log("toggleMenu called");
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (sidebar.style.display === 'none') {
        sidebar.style.display = 'block';
      } else {
        sidebar.style.display = 'none';
      }
    }
    this.showMenu = !this.showMenu;

  }

  signout() {
    localStorage.removeItem("user");
    window.location.href = "/user";
  } 

   get isSignedIn(): boolean {
    return localStorage.getItem("user")  !== "";
  }
}
