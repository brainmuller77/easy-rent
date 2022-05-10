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
  loading:boolean = true
  content = []
  user = {};
  server
  username: any;
  constructor(private storage:Storage,private router:Router,
    private modalController: ModalController,public authservice:AuthService) { 
   
  }

  async ngOnInit() {
    
    await this.storage.create();
    this.loading=false
   this.server = this.authservice.server
   this.getPosts()
  }

  add_room(){
    this.router.navigate(["/add-listing"])
  }

  liked(post){
    post.pinned =!post.pinned;
    if(post.pinned){
     post.pinned = true;
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
          });
        
  }

  async gotoMessage(a){
    const modal = await this.modalController.create({
      component:MessagesPage,
      componentProps: { item: a },
    });
    return await modal.present();
  }

  getPosts(){
    this.authservice.getPosts().subscribe((res:any)=>{
      if(res.message=="Done"){
        console.log(res.posts)
        for(let post of res.posts){
          this.content.push(post)
        }
       
      }
      
      
    })
  }

 
}
