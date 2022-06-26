import { Component, OnInit } from '@angular/core';
import { ServicesService } from './services.service';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Find Rooms', url: 'listings', icon: 'search' },
    { title: 'Inbox', url: 'inbox', icon: 'mail' },
   // { title: 'Favorites', url: '/favourites', icon: 'heart' },
    { title: 'Add Rooms', url: '/add-listing', icon: 'add-circle' },
    //{ title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Logout', url: '/sign-in', icon: 'warning' },
  ];
  loggedin
  username
 //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  user: any;
  constructor(private service:AuthService,private storage: Storage) {

  }
  ngOnInit(): void {
  this.loggedin = this.service.isLoggedIn
  this.getStorage()
  }

  async getStorage(){
    await this.storage.create()
  
    this.storage.get('session_storage').then((response:any)=>{
      
      this.user=response
      this.username = this.user['username'];
     
      console.log(this.username)
      
          });
  }
}
