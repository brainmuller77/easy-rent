import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FolderPage } from 'src/app/folder/folder.page';
import { AuthService } from 'src/app/services/auth.service';
import { MessagesPage } from '../messages/messages.page';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
})
export class ListingsPage implements OnInit {
  loading:boolean
  content = []
  user = {};
  likedpost:boolean = false;
  server
  filterTerm
  loggedIn:boolean
  username: any;
  constructor(private storage:Storage,private router:Router,
    private modalController: ModalController,public authservice:AuthService) { 
   this.user = {
     username:{},profilePic:{}
   }
  }

  async ngOnInit() {
    this.authservice.isLoggedIn 
    
    await this.storage.create();
    this.loading=true
   this.server = this.authservice.server
   this.getPosts()
  }

  add_room(){
    this.router.navigate(["/add-listing"])
  }

  liked(post){
    post.pinned =!post.pinned;
    if(post.pinned){
      post.likes.length++;
    }else{
      post.likes.length--;
    }
  } 

  
 

  async gotoEditPage(row: any) {
   // this.func.setStorageJson('item', row || {});
    const modal = await this.modalController.create({
      component:FolderPage,
      componentProps: { item: row },
    });

    modal.onDidDismiss()
      .then((data) => {
        if(data.data != undefined){
          this.getPosts()
        }

    });

    return await modal.present();
  }

  ionViewDidEnter(){
    this.storage.get('session_storage').then((response:any)=>{
      
      this.user=response
      this.username = this.user['username'];
      console.log(this.user['isVerified'])
          });
         
        
  }

  call(item){
    window.open('tel:'+item.user.phonenumber)
   }
  async gotoMessage(a){
    const modal = await this.modalController.create({
      component:MessagesPage,
      componentProps: { item: a },
    });
    return await modal.present();
  }

  getPosts(){
    this.loading = true
    this.authservice.getPosts().subscribe((res:any)=>{
      setTimeout(() => {
        if(res.message=="Done"){
          this.loading = false
          console.log(res.posts)
          for(let post of res.posts){
            this.content.push(post)
            if(post.likes.includes(this.user['id'])===true){
              this.likedpost = true
            }else{
              this.likedpost = false
            }
          }
        
        }
        this.loading = false
      },15000);
      
      
      
    })
  }

 
}
