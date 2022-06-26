import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MessagesPage } from '../messages/messages.page';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  searchMessageList: FormControl = new FormControl('');
  showSearchbar = false;
  isIos = false;
  load:boolean;
  server
  postData = {
    message:""
  }
  item
  title
  chatsmessages = []
  user: any={};
  username: any;
  userid: any;
  chatList: any[]= [];
  constructor(private modalController: ModalController,
    private storage: Storage,
    private authservice: AuthService,) { }

  async ngOnInit() {
    this.server = this.authservice.server
    await this.storage.create()
    this.storage.get('session_storage').then((response:any)=>{
    
      this.user=response
      this.username = this.user['username'];
      this.userid = this.user['_id']
      console.log(this.user)
      this.GetUser()
          });

          

       
  }

  ionViewDidEnter(){
   
  }

   /**
   * On refresh
   */
    doRefresh(event) {
      this.GetUser();
  
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 1000);
    }

  GetUser() {
    let body = this.user._id
    this.authservice.GetUserById(body).subscribe(data => {
      
     this.chatList = data.result[0].chatList;
     console.log(this.chatList)
     /*  for(let post of data.result[0].chatList){
        this.chatList.push(post)
        console.log(this.chatList)
      } */
      
    });
  }

  getMessages(){
    this.authservice.GetAllMessages(this.user._id,this.item._id).subscribe((res:any)=>{
      if(res.message=="Messages returned"){
        for(let message of res.messages.message){ 
          message.createdAt = this.chatdate(message.createdAt)
      this.chatsmessages.push(message)
        }
      }
    })

  }

  chatdate(time){
  
    return moment(time, "hh").format('LT')
   }

   GetTime(time) {
    const todaysDate = new Date();
    const date = new Date(time);

    const d1 = moment(new Date(todaysDate));
    const d2 = moment(new Date(date));

    const d3 = d1.diff(d2, 'days');

    if (d3 === 0) {
      return moment(time).format('LT');
    } else {
      return moment(time).format('DD/MM/YYYY');
    }
  }

  async gotoMessage(item){
    const modal = await this.modalController.create({
      component:MessagesPage,
      componentProps: { item: item },
    });
    console.log(item)
    return await modal.present();
  }

  CheckIfFalse(arr, name) {
    let total = 0;
    _.forEach(arr, val => {
      if (val.isRead === false && val.receivername !== name) {
        total += 1;
      }
    });

    return total;
  }
   
}
