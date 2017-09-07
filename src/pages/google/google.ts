import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';

import { DataModalPage } from '../data-modal/data-modal';
import { HomePage } from '../home/home';

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
              private file:File,
              private toastCtrl: ToastController,
              ) {

		this.title = this.navParams.get('title');
    this.records = this.navParams.get('records');
    this.flag = this.navParams.get('flag');

    if(this.flag)
      this.viewData();
    // {
    //   this.flag = false;
    //   this.viewData();
    // }
  }

  // generateData(record: Record) {
  //     return new Promise<Record>((resolve, reject) => {
      
  //       // record.Bearing = 0;
          

  //         setTimeout( () => {
  //             resolve(record);
  //         }, 1500);

  //     });
  // }

  record():void
	{
    this.presentToast('Getting Location.Please wait...');
    let record:Record = new Record;
    
    this.geolocation.getCurrentPosition({enableHighAccuracy:true})
    .then((resp) => {

      record.Latitude = resp.coords.latitude;
      record.Longitude = resp.coords.longitude;

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
              
              let string = record.Latitude.toString() + "," + record.Longitude.toString() + "," + record.Comment;
              this.save(string);
              
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

  presentToast(message):void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  save(record: string):void{
    this.file.readAsText(this.file.externalApplicationStorageDirectory, this.title+".csv")
    .then(data => {
      if(data == '')
        data += "Latitude,Longitude,Description\r\n" + record;
      else
        data += "\r\n" + record;
      this.file.writeExistingFile(this.file.externalApplicationStorageDirectory, this.title +".csv",data);
    })
    .catch(error => console.log(error) );
  }

  viewData():void{
    this.navCtrl.push(DataModalPage,{records: this.records,title:this.title});
    // this.navCtrl.push(HomePage);
  }
}

export class Record{
  Comment:string;
  Latitude:number;
  Longitude:number;
  
  // Distance:number;
  // Bearing:number;
  // CumulativeDistance:number;
  
  // EastWestCoordinate:number;
  // NorthSouthCoordinate:number;
}