import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Record } from '../google/google';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ActionSheetController } from 'ionic-angular';

@Component({
  selector: 'page-data-modal',
  templateUrl: 'data-modal.html',
})
export class DataModalPage {

  records:Record[] = [];
  title:string;
  
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private socialSharing: SocialSharing,
              private actionSheetCtrl: ActionSheetController,
              private file:File){
                
    this.records = navParams.get('records');
    this.title = navParams.get('title');

  }

  share():void{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    
    let body = {
      records: this.records
    };

    this.socialSharing.shareViaEmail("GeoRecorder Project.\nTitle : " + this.title,
                                       "GeoRecorder Project.\nTitle : " + this.title,
                                       [],[],[],
                                       this.file.externalApplicationStorageDirectory + "/" + this.title + ".csv")
    .then(()=>console.log("redirect to gmail successful"))
    .catch(()=>console.log("redirect to gmail unsuccessful"));
  }

  goToGooglePage():void {
    this.navCtrl.pop();
  }

  showOptions():void{
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      enableBackdropDismiss:true,
      buttons: [
        {
          text: 'Continue recording',
          icon: 'add-circle',
          handler: () => {
            this.goToGooglePage();
          }
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            this.share();
          }
        },
        // {
        //   text: 'Generate Map',
        //   icon: 'analytics',
        //   handler: () => {
        //     window.alert("Under implementation");
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    actionSheet.present();
  }

  generateMap():void{
    window.alert("implementing");
  }

}