import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NewProjectPage } from '../new-project/new-project';
import { OpenFilePage } from '../open-file/open-file';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
   constructor(public navCtrl: NavController,
              private diagnostic: Diagnostic,
              private alertCtrl: AlertController,
              private platform: Platform){    
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.diagnostic.isGpsLocationEnabled()
      .then((modeStatus)=>{
        if(!modeStatus)
        {
          this.diagnostic.isLocationEnabled()
          .then((locationStatus)=>{
            if(!locationStatus)
              this.showLocationAlert('Turn on location!','Please set location to high accuracy');
            else
              this.showLocationAlert("High accuracy location mode required!",'Please set location to high accuracy');
          });
        }
      })
    });
  }

  newProject():void{
    this.navCtrl.push(NewProjectPage);
  }

  openProject():void{
    this.navCtrl.push(OpenFilePage);
  }

  showLocationAlert(title,message):void{
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Turn on',
          handler: () => {
            alert.dismiss();
            this.diagnostic.switchToLocationSettings();
            return false;
          }
        }
      ]
    });
    alert.present();
  }
}