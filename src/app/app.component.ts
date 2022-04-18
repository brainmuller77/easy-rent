import { Component, OnInit } from '@angular/core';
import { ServicesService } from './services.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Find Rooms', url: 'listings', icon: 'search' },
    { title: 'Inbox', url: 'messages', icon: 'mail' },
    { title: 'Favorites', url: '/favourites', icon: 'heart' },
    { title: 'Add Rooms', url: '/add-listing', icon: 'add-circle' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Logout', url: '/sign-in', icon: 'warning' },
  ];
  loggedin
 public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private service:ServicesService) {

  }
  ngOnInit(): void {
  this.loggedin = this.service.loggedin
  }
}
