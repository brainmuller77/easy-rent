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
  server
  postData = {
    message:""
  }
  item
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
    private authservice: AuthService,
    public alertController: AlertController,
    private fb: FormBuilder,) { }

  async ngOnInit() {
    this.storage.get('session_storage').then((response:any)=>{
    
      this.user=response
      this.username = this.user['username'];
      this.userid = this.user['_id']
      console.log(this.user)
      
          });
    
    this.message = this.fb.group({
      messageControl: this.fb.control('', [
        Validators.required,
        
      ]),
  })

  await this.storage.create();
    this.load=false
   this.server = this.authservice.server
}


  getMessages(){
    this.authservice.GetAllMessages(this.user._id,this.item._id).subscribe((res:any)=>{
      console.log(res.messages.message)
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



  dismiss(){
    this.modalController.dismiss()
  }

  sendMessage(){
    let body = {
      message:this.postData.message,
      senderId:this.user,
      receiverId:this.item._id,
      sendername:this.username,
      receivername:this.item.username
      
    }
    this.authservice.SendMessage(body).subscribe((res:any)=>{
      if(res.message=="Sent"){
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

         // scroll to bottom
      setTimeout(() => {
        this.content.scrollToBottom(0);
      });
      }
      
    })
  }
}

