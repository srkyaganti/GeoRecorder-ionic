import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
// import { File } from '@ionic-native/file';

import { DataModalPage } from '../data-modal/data-modal';
import { ShowRecordPage } from '../show-record/show-record';

@Component({
  selector: 'page-google',
  templateUrl: 'google.html',
})
export class GooglePage {

  flag:boolean;
  title:string;
  
  records :Record[] = [];
  length :number;

	constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private geolocation: Geolocation,
              private toastCtrl: ToastController,
              ) {

		this.title = this.navParams.get('title');
    this.records = this.navParams.get('records');
    this.flag = this.navParams.get('flag');
    this.length = this.records.length;

    if(this.flag)
      this.viewData();
  }

  toDegrees (angle): number 
  {
    return angle * (180 / Math.PI);
  }
  
  toRadians (angle): number 
  {
    return angle   * (Math.PI / 180);
  }
  
  generateData(record: Record) {
      return new Promise<Record>((resolve, reject) => {

        if(this.length == 0)
        {
          record.Distance = 0;
          record.Bearing = 0;
          record.CumulativeDistance = 0;
          record.EastWestCoordinate = 0;
          record.NorthSouthCoordinate = 0;  
        }
        else
        {
          var R = 6371e3;
          var φ1 = this.toRadians(this.records[this.length-1].Latitude);
          var φ2 = this.toRadians(record.Latitude);
          var Δφ = this.toRadians(record.Latitude-this.records[this.length-1].Latitude);
          var Δλ = this.toRadians(record.Longitude - this.records[this.length-1].Longitude);
          
          var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          
          record.Distance = parseFloat((R * c).toFixed(3));
          
          var y = Math.sin(
                    this.toRadians(record.Longitude)
                    -this.toRadians(this.records[this.length-1].Longitude)
                  ) 
                  *Math.cos(φ2);
          
          var x = Math.cos(φ1)
                  *Math.sin(φ2) 
                  -Math.sin(φ1)
                  *Math.cos(φ2)
                  *Math.cos(
                    this.toRadians(record.Longitude)
                    -this.toRadians(this.records[this.length-1].Longitude)
                  );
          
          record.Bearing = parseFloat(
                              this.toDegrees(Math.atan2(y, x)).toFixed(3)
                            );
                            
          record.CumulativeDistance = this.records[this.length-1].CumulativeDistance + record.Distance;
        
          record.EastWestCoordinate = parseFloat(
                                        (
                                          this.records[this.length-1].EastWestCoordinate
                                          +record.Distance
                                          *Math.sin(this.toRadians(record.Bearing))
                                        ).toFixed(3)
                                      );

          record.NorthSouthCoordinate = parseFloat(
                                          (
                                            this.records[this.length-1].NorthSouthCoordinate
                                            +record.Distance
                                            *Math.cos(this.toRadians(record.Bearing))
                                          ).toFixed(3)
                                        ); 
        }

        resolve(record);
      });
  }

  recordData():void
	{
    this.presentToast();
    let record:Record = new Record;
    
    this.geolocation.getCurrentPosition({enableHighAccuracy:true})
    .then((resp) => {

      record.Latitude = resp.coords.latitude;
      record.Longitude = resp.coords.longitude;
      // record.LocationAccuracy = resp.coords.accuracy;

      // record.Altitude = resp.coords.altitude || 0;
      // record.AltitudeAccuracy = resp.coords.altitudeAccuracy || 0;

      this.generateData(record)
      .then( responseRecord => {
        record = responseRecord;
        this.navCtrl.push(ShowRecordPage,{title: this.title,records: this.records,record: record});
      });    

      // let alert = this.alertCtrl.create({
      //   subTitle: "<h3>Current Location</h3><hr><b>Latitude :</b> "
      //             + record.Latitude
      //             + "<br><b>Longitude :</b> "
      //             +  record.Longitude
      //             + "<br><hr><b>Point Description</b>(Optional) ",
      //   inputs: [
      //     {
      //       name: 'comment',
      //       placeholder: 'Description',
      //     }
      //   ],
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       handler:data  => {
      //         alert.dismiss();
      //         return false;
      //       }
      //     },
      //     {
      //       text: 'Save',
      //       handler:data  => {
      //         alert.dismiss();
      //         record.Comment = data.comment;
              
      //         let string = "\r\n" + record.Latitude.toString() + "," + record.Longitude.toString() + record.Comment;
      //         this.save(string);
              
      //         this.records.push(record);
      //         return false;
      //       }
      //     }
      //   ]
      // });
      // alert.present();

    })
    .catch((error)=>window.alert(error));
  }

  // save(record: string):void{
  //   this.file.readAsText(this.file.externalApplicationStorageDirectory, this.title+".csv")
  //   .then(data => {
      
  //     data += record;
      
  //     // if(data == '')
  //     //   data += "Latitude,Longitude,Description\r\n" + record;
  //     // else
  //     //   data += "\r\n" + record;

  //     this.file.writeExistingFile(this.file.externalApplicationStorageDirectory, this.title +".csv",data);
  //   })
  //   // .catch(error => console.log(error) );
  // }

  presentToast():void {
    let toast = this.toastCtrl.create({
      message: "Getting Location.Please wait...",
      duration: 4000,
      position: 'bottom'
    });
    toast.present();
  }

  viewData():void{
    this.navCtrl.push(DataModalPage,{records: this.records,title:this.title});
  }
}

export class Record{
  SNo: number;

  Comment: string;
  
  Latitude: number;
  Longitude: number;

  // LocationAccuracy: number;

  // Altitude: number;
  // AltitudeAccuracy: number;
  
  Distance: number;
  Bearing: number; 
  CumulativeDistance: number;
  
  EastWestCoordinate: number;
  NorthSouthCoordinate: number;
}