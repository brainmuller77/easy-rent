import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ModalController, AlertController, IonContent, IonItemSliding } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import * as moment from 'moment';
import { BehaviorSubject, SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  message: FormGroup;
  load:boolean;
  returned:boolean
  server
  postData = {
    message:""
  }
  item
  date
  title
  chatsmessages = []
  user: any;
  username: any;
  userid: any;

  pageScrolling = false;
  isAllowScroll = true;
  scrolling: BehaviorSubject<boolean> = new BehaviorSubject(false);

  subscriptions: SubscriptionLike[] = [];
  @ViewChild(IonContent) private content: IonContent;
  
  constructor(private storage: Storage,
    private route: ActivatedRoute,
    private loading: LoadingService,
    private modalController: ModalController,
    public authservice: AuthService,
    public alertController: AlertController,
    private fb: FormBuilder,) { 
      
    }

  async ngOnInit() {
    this.storage.get('session_storage').then((response:any)=>{
      this.user=response
      this.username = this.user['username'];
      this.userid = this.user['_id']
     
      console.log(this.user._id)
      
          });
          console.log(this.item)
    
    this.message = this.fb.group({
      messageControl: this.fb.control('', [
        Validators.required,
        
      ]),
  })

  await this.storage.create();
    this.load=false
   this.server = this.authservice.server
}

gotoEditPage(item){

}


  getMessages(){
    this.authservice.GetAllMessages(this.user._id,this.item._id).subscribe((res:any)=>{
      if(res.message=="Messages returned"){
        this.returned = true;
        for(let message of res.messages.message){ 
         this.date = message.createdAt;
      this.chatsmessages.push(message)

        }
      }
      console.log(this.chatsmessages)
    })

  }

  
  /**
   * Reply message (drag)
   * @param {Event} event - drag event
   * @param {IonItemSliding} slidingItem - item sliding directive
   */
   messageDraged(event, slidingItem: IonItemSliding) {
    if (event.detail.ratio === 1) {
      slidingItem.closeOpened();
    }
  }

timeFromNow(time) {
  return moment(time).fromNow();
}

chatdate(time){
  
 return moment(time, "hh").format('LT')
}

ionViewDidEnter(){
  
  
    this.getMessages()  
}


/**
   * Content scroll start
   */
 logScrollStart() {
  this.scrolling.next(true);
}

/**
 * Content scrolling
 */
logScrolling(event) {
  // console.log('Scrolling');
}

/**
 * Content scroll end
 */
logScrollEnd() {
  this.scrolling.next(false);
}

dateToFromNowDaily( myDate ) {

  // get from-now for this date
  var fromNow = moment( myDate ).fromNow();

  // ensure the date is displayed with today and yesterday
  return moment( myDate ).calendar( null, {
      // when the date is closer, specify custom values
      lastWeek: '[Last] dddd',
      lastDay:  '[Yesterday]',
      sameDay:  '[Today]',
      nextDay:  '[Tomorrow]',
      nextWeek: 'dddd',
      // when the date is further away, use from-now functionality             
      sameElse: function () {
          return "[" + fromNow + "]";
      }
  });
}

  dismiss(){
    this.modalController.dismiss()
  }

  sendMessage(){
    this.load = true
    let body = {
      message:this.postData.message,
      senderId:this.user,
      receiverId:this.item,
      sendername:this.username,
      receivername:this.item.username
      
    }
    this.authservice.SendMessage(body).subscribe((res:any)=>{
      if(res.message=="Sent"){
        this.load = false
        this.returned = false
        this.chatsmessages.push({
          firstname:this.user['firstName'],
          lastname:this.user['lastName'],
          sendername:this.username,
          profilepic:this.user['profilePic'],
          body: this.postData.message,
          date: this.timeFromNow(new Date()),
          chatdate:this.chatdate(new Date())
        })
        console.log(res)
        console.log(this.chatsmessages)
        this.postData.message = ''

         // scroll to bottom
      setTimeout(() => {
        this.content.scrollToBottom(0);
      });
      }
      
    })
  }
}

