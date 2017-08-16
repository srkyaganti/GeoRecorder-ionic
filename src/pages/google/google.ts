import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { DataModalPage } from '../data-modal/data-modal';

@Component({
  selector: 'page-google',
  templateUrl: 'google.html',
})
export class GooglePage {

  confirmExit:boolean;
	showAlert:boolean;
  flag:boolean;
  title:string;

  records :Record[] = [];

	constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private alertCtrl: AlertController,
              private geolocation: Geolocation,
              private toastCtrl: ToastController,
              ) {

		this.title = this.navParams.get('title');
    this.records = this.navParams.get('records');
    this.flag = this.navParams.get('flag');

    this.confirmExit = false;
    this.showAlert = true;
  }

  ionViewDidEnter(){
    if(this.flag)
    {
      this.flag = false;
      this.viewData();
    }
    else
    {
      this.confirmExit = false;
      this.showAlert = true;
    }
  }

  //synchronous system
  record():void
	{
    this.presentToast('Getting Location.Please wait...');
    let record:Record = new Record;
    
    this.geolocation.getCurrentPosition({enableHighAccuracy:true})
    .then((resp) => {
      record.Latitude = resp.coords.latitude;
      record.Longitude = resp.coords.longitude;

      // Showing alert for comment
      let alert = this.alertCtrl.create({
          subTitle: "<h3>Current Location</h3><hr><b>Latitude :</b> "
                    + record.Latitude
                    + "<br><b>Longitude :</b> "
                    +  record.Longitude
                    + "<br><hr><b>Point Description</b>(Optional) ",
          inputs: [
            {
              name: 'comment',
              placeholder: 'Description',
            }
          ],
          buttons: [
            {
              text: 'Cancel',
              handler:data  => {
                alert.dismiss();
                return false;
              }
            },
            {
              text: 'Save',
              handler:data  => {
                alert.dismiss();
                record.Comment = data.comment;
                this.records.push(record);
                return false;
              }
            }
          ]
      });
      alert.present();
    })
    .catch((error)=>window.alert(error));
  }

  viewData():void
	{
    this.showAlert = false;//to disable ionViewCanLeave
    this.confirmExit = true;//to disable ionViewCanLeave
    this.navCtrl.push(DataModalPage,{records: this.records,title:this.title});
	}

	ionViewCanLeave():boolean{
    if(this.showAlert){

        let alert = this.alertCtrl.create({
        cssClass: 'alert',
        title: 'Exit',
        message: 'Do you want to exit? All unsaved changes will be lost.',
        buttons: [{
            text: 'Exit',
            handler: () => {
              alert.dismiss();
              this.confirmExit = true;
              this.showAlert = false;
              this.navCtrl.popToRoot();
              return false;
            }
          },
          {
            text: 'Cancel',
            handler: () => {
              alert.dismiss();
              return false;
            }
          }
        ]
      });
      alert.present();

    }
    return this.confirmExit;
  }

  presentToast(message):void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }
}

export class Record{
  Comment:string;
  Latitude:number;
  Longitude:number;
}