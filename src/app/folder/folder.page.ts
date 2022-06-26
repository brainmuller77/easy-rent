declare var apiRTC: any;
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { CometChat } from "@cometchat-pro/chat";
import SwiperCore, { Autoplay, FreeMode, Keyboard, Navigation, Pagination, Scrollbar, Swiper, Thumbs, Zoom } 
from 'swiper';
import { IonicSlides } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { CallsPage } from '../pages/calls/calls.page';
SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar,FreeMode, Navigation, Thumbs, Zoom,IonicSlides]);


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class FolderPage implements OnInit {
  thumbsSwiper
  paymentAmount: string = '3.33';
  currency: string = 'USD';
  currencyIcon: string = '$';
  public folder: string;
  item;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  mode
  pager

  constructor(private activatedRoute: ActivatedRoute,
    private paypal:PayPal,
    public loading: LoadingService,
    public authservice:AuthService,
    private modalController:ModalController) {
     
     }

  ngOnInit() {
    this.folder = this.item.title;
    console.log(this.item)
  }



  dismiss(){
    this.modalController.dismiss();
  }

  call(){
   window.open('tel:'+this.item.user.phonenumber)
  }

  callaudio(){
    let authKey = "248243a420f93bc6a81b7c9e23f12f31c028f84f";
var uid = "user1";
var name = "Kevin";

var user = new CometChat.User(uid);
user.setName(name);
CometChat.createUser(user, authKey).then(
    user => {
        console.log("user created", user);
    },error => {
        console.log("error", error);
    }
)
  }

  payWithPaypal() {
   this.loading.alert("Confirm Payment",`You are paying an amount of ${this.item.price} GHC for ${this.item.title}
   to ${this.item.username}`)
    this.paypal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'ATU0atnxCaZ03fdiCezJf86-Dw9izwjJccRqWx_f5-NrxdZ7cz50rqclsCwBg_ohvT4Hg-YX-dk3TKYr'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.paypal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
        this.paypal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          // Successfully paid

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    loop: true,
    watchSlidesProgress: true
  });

 async open(a){
    const modal = await this.modalController.create({
      component:CallsPage,
      componentProps: { item: a},
    });
    return await modal.present();
  }
  
  getOrcreateConversation() {
    var localStream = null;

    //==============================
    // 1/ CREATE USER AGENT
    //==============================
    var ua = new apiRTC.UserAgent({
      uri: 'apzkey:58b1bb4098acd3f7b93d04a6d0892e66'
    });

    //==============================
    // 2/ REGISTER
    //==============================
    ua.register().then((session) => {

      //==============================
      // 3/ CREATE CONVERSATION
      //==============================
      const conversation = session.getConversation(this.item.username);

      //==========================================================
      // 4/ ADD EVENT LISTENER : WHEN NEW STREAM IS AVAILABLE IN CONVERSATION
      //==========================================================
      conversation.on('streamListChanged', (streamInfo: any) => {
        console.log("streamListChanged :", streamInfo);
        if (streamInfo.listEventType === 'added') {
          if (streamInfo.isRemote === true) {
            conversation.subscribeToMedia(streamInfo.streamId)
              .then((stream) => {
                console.log('subscribeToMedia success');
              }).catch((err) => {
                console.error('subscribeToMedia error', err);
              });
          }
        }
      });
      //=====================================================
      // 4 BIS/ ADD EVENT LISTENER : WHEN STREAM IS ADDED/REMOVED TO/FROM THE CONVERSATION
      //=====================================================
      conversation.on('streamAdded', (stream: any) => {
        stream.addInDiv('remote-container', 'remote-media-' + stream.streamId, {}, false);
      }).on('streamRemoved', (stream: any) => {
        stream.removeFromDiv('remote-container', 'remote-media-' + stream.streamId);
      });

      //==============================
      // 5/ CREATE LOCAL STREAM
      //==============================
      ua.createStream({
        constraints: {
          audio: true,
          video: true
        }
      })
        .then((stream: any) => {

          console.log('createStream :', stream);

          // Save local stream
          localStream = stream;
          stream.removeFromDiv('local-container', 'local-media');
          stream.addInDiv('local-container', 'local-media', {}, true);

          //==============================
          // 6/ JOIN CONVERSATION
          //==============================
          conversation.join()
            .then((response: any) => {
              //==============================
              // 7/ PUBLISH LOCAL STREAM
              //==============================
              conversation.publish(localStream);
            }).catch((err) => {
              console.error('Conversation join error', err);
            });

        }).catch((err) => {
          console.error('create stream error', err);
        });
    });
  }

}
