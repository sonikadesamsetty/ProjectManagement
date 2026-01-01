import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userEmail = '';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // try to load logged-in user email if available
    try {
      this.userEmail = localStorage.getItem("user") || '';
    } catch (e) {
      this.userEmail = '';
    }
  }

 
}