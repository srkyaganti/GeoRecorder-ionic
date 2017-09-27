import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

import { Record } from '../google/google';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ActionSheetController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Http, Headers, RequestOptions } from '@angular/http';

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
              private file:File,
              private device: Device,
              public http: Http){
                
    this.records = navParams.get('records');
    this.title = navParams.get('title');

  }

  share():void{
    
    let headers = new Headers(
    {
      'Content-Type' : 'application/json'
    });
      
    let options = new RequestOptions({ headers: headers });

    let data = {
      uuid: this.device.uuid,
      name: this.title,
      records: this.records
    }

    this.http.post('http://139.59.11.28/api/gr/store',data,options)
    .subscribe();
    
    this.socialSharing.shareViaEmail("",
                                     "GeoRecorder : " + this.title,
                                     [],[],[],
                                     this.file.externalApplicationStorageDirectory + "/" + this.title + ".csv");
    // .then(()=>console.log("redirect to gmail successful"))
    // .catch(()=>console.log("redirect to gmail unsuccessful"));
  }

  goToGooglePage():void {
    this.navCtrl.pop();
  }

  showOptions():void{
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options',
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
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close'
        }
      ]
    });
    actionSheet.present();
  }
}