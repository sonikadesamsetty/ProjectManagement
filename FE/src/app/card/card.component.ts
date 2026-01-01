import { Component, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Story } from '../models/story';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{
  
  @Input() newState: string = '';

  @Input() story!: Story;

  ngOnInit(): void {
    console.log(this.story);
    console.log(this.newState);
  }

  getInitials(name: string): string {
  if (!name) return '';
  const parts = name.trim().split(' ');
  return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
}

}
