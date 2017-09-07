import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Record,GooglePage } from '../google/google';

import { ActionSheetController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-open-file',
  templateUrl: 'open-file.html',
})
export class OpenFilePage {

  projects:string[] = [];
  records :Record[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController, 
              private actionSheetCtrl: ActionSheetController,
              private socialSharing: SocialSharing,
              private file:File) {
              
    this.loadList();
  }

  openProject(projectName:string):void{

    this.file.checkFile(this.file.externalApplicationStorageDirectory, projectName+".csv")
    .then(()=>{
      this.file.readAsText(this.file.externalApplicationStorageDirectory, projectName+".csv")
      .then((result)=>{
        let results:string[] = result.split("\r\n");
        let length = results.length;
        for(let i=1;i<length;i++)
        {
          let temp:string[] = results[i].split(',');
          this.records.push({ Comment:temp[2],Latitude:parseFloat(temp[0]),Longitude:parseFloat(temp[1]) });
        }
        this.navCtrl.setRoot(GooglePage,{records: this.records, title: projectName,flag:true});
      })
      .catch(()=>window.alert('failed to read'));
    })
    .catch(()=>{
      let alert = this.alertCtrl.create({
        cssClass: 'alert',
        title: 'Exit',
        message: 'Project Missing or might have been deleted accidentally.\nProject will be removed from the list',
        buttons: [{
            text: 'OK',
            handler: () => {
              alert.dismiss().then(()=>this.deleteProject(projectName));
            }
          }
        ]
      });
      alert.present();
    });
  }

  updateName(oldName:string,newName:string)
  {
    this.projects[this.projects.indexOf(oldName)] = newName;
    this.file.checkFile(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then(()=>{
      this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
      .then((result)=>{
        result = result.replace(oldName,newName);
        this.file.writeExistingFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",result);
      });
    });
  }

  updateFile(oldName:string, newName:string):void
  { 
    this.file.readAsText(this.file.externalApplicationStorageDirectory,oldName+".csv")
    .then((result)=>this.file.writeExistingFile(this.file.externalApplicationStorageDirectory,newName+".csv",result));

    this.file.removeFile(this.file.externalApplicationStorageDirectory,oldName+".csv");
  }

  editName(projectName:string)
  {
    let alert = this.alertCtrl.create({
        title: 'Edit name',
        inputs: [
        {
          name: 'newName',
          placeholder: 'New Name',
          type:'string',
          value: projectName
        }
        ],
        buttons: [
          {
            text: 'Save',
            handler:data  => {
              alert.dismiss();
              this.updateName(projectName,data.newName.trim());
              this.updateFile(projectName,data.newName.trim());
            }
          },
          {
            text: 'Cancel',
            handler:data  => {
              alert.dismiss();
              return false;
            }
          },
        ]
    });
    alert.present();
  }

  deleteProject(projectName:string):void{
    
    this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then((result)=>{
      result = result.replace(projectName+"\r\n","");
      result = result.replace(projectName,"");
      this.file.writeExistingFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",result);  
    });

    this.projects.splice(this.projects.indexOf(projectName),1);
    
    this.file.removeFile(this.file.externalApplicationStorageDirectory,projectName+'.csv');
  }

  shareProject(projectName:string):void{
    this.socialSharing.shareViaEmail('','',[],[],[],this.file.externalApplicationStorageDirectory + "/" + projectName + ".csv")
  }

  warning(projectName):void{
    let alert = this.alertCtrl.create({
      cssClass: 'alert',
      title: 'Exit',
      message: 'Are you sure you want to delete the project : ' + projectName,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss().then(()=>this.deleteProject(projectName));
          }
        },
        {
          text: 'Cancel'
        }
      ]
    });
    alert.present();
  }

  presentActionSheet(projectName:string) {
   let actionSheet = this.actionSheetCtrl.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      enableBackdropDismiss:true,
      buttons: [
        {
          text: 'View',
          icon: 'list-box',
          handler: () => {
            this.openProject(projectName);
          }
        },
        {
          text: 'Rename',
          icon: 'create',
          handler: () => {
            this.editName(projectName);
          }
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.warning(projectName);
            // this.deleteProject(projectName);
          }
        },
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            this.shareProject(projectName);
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

  loadList():void{
    this.file.checkFile(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then(()=>{
      this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
      .then((result)=>{
        if(result != '')
          this.projects = result.split("\r\n");  
      })
    });
  }

  
}
