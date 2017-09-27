import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Record } from '../google/google';
import { File } from '@ionic-native/file';
import { GooglePage } from '../google/google';

@Component({
  selector: 'page-show-record',
  templateUrl: 'show-record.html',
})
export class ShowRecordPage {


  record: Record;
  callback: any;
  comment: string;
  records :Record[] = [];
  length :number;
  title: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private file:File,) {

    this.record = this.navParams.get('record');
    
    this.title = this.navParams.get('title');
    this.records = this.navParams.get('records');
    this.length = this.records.length;
    this.comment = "";
  }

  sendData(): void{

    this.length = this.length + 1;

    this.record.SNo = this.length;
    this.record.Comment = this.comment;
    
    let result = "\r\n"
                + this.record.SNo.toString() + ","
                + this.record.Comment + ","
                + this.record.Latitude.toString() + ","
                + this.record.Longitude.toString() + ","
                // + this.record.LocationAccuracy.toString() + ","
                // + this.record.Altitude.toString() + ","
                // + this.record.AltitudeAccuracy.toString() + ","
                + this.record.Distance.toString() + ","
                + this.record.Bearing.toString() + ","
                + this.record.CumulativeDistance.toString() + ","
                + this.record.EastWestCoordinate.toString() + ","
                + this.record.NorthSouthCoordinate.toString();
    
    this.file.readAsText(this.file.externalApplicationStorageDirectory, this.title +".csv")
    .then(data => {
      data += result;
      
      this.file.writeExistingFile(this.file.externalApplicationStorageDirectory, this.title +".csv",data)
      .then(()=>{
        this.records.push(this.record); 
        this.navCtrl.setRoot(GooglePage,{title:this.title,records:this.records,flag:false})
      })
      .catch((error) => window.alert("Failed to save file"));

    })
    .catch(error => window.alert("Filed to save file"));
  }

  goBack()
  {
    this.navCtrl.pop();
  }
  
}
