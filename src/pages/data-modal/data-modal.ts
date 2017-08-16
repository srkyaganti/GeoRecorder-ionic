import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Record } from '../google/google';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ToastController } from 'ionic-angular';

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
              private file:File,
              private toastCtrl: ToastController) {
                
    this.records = navParams.get('records');
    this.title = navParams.get('title');

  }

  save():void{
    this.file.writeExistingFile(this.file.externalApplicationStorageDirectory, this.title + ".csv", this.ConvertToCSV(this.records))
    .then(()=>{
      this.presentToast("File saved successfully!");
    })

    this.file.checkFile(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then(()=>{
      //If file exists add new project name to end of string
      this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
      .then((result)=>{
        //add project name to list of not already saved previously
        if(result.split("\r\n").indexOf(this.title) == -1)//  result.split("\n")[0] != this.title)
        {
          if(result == '')
            result = this.title;
          else
            result = this.title + '\r\n' + result;
          this.file.writeExistingFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",result)
          // .then(()=>this.presentToast("File saved successfully!"))
          // .catch(()=>this.presentToast("File save failed!"));
        }
        
      })
      .catch(()=>{
        console.log("File does not exist");
        this.file.writeFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",this.title)
        // .then(()=>this.presentToast("File saved successfully!"))
        // .catch(()=>console.log("File save failed!"));
      });
    })
    .catch(()=>{
      console.log('ListOfProjects file does not exists');
      this.file.writeFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",this.title)
      // .then(()=>this.presentToast("FileSaved"))
    });
  }


  share():void{
    this.save();
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

  ConvertToCSV(objArray):string {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = 'Latitude,Longitude,Description\r\n';

    let length = array.length;
    for (var i = 0; i < length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }
        str += line;
        if(i != array.length - 1)
          str += '\r\n';
    }
    return str;
  }

  presentToast(message):void {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

}