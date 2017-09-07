import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';

import { GooglePage } from '../google/google';
import { File } from '@ionic-native/file';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-new-project',
  templateUrl: 'new-project.html',
})
export class NewProjectPage {

  title:string;
  projects:string[] = [];

  constructor(private navCtrl: NavController,
              private file:File,
              private toastCtrl: ToastController,) { }

  createProject():void{
    
    this.file.checkFile(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then(()=>{
      this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
      .then((result)=>{
        this.projects = result.split("\r\n");
        if(this.projects.indexOf(this.title) != -1)
        {
            this.presentToast();
            this.title = "";
        }
        else
          this.next();
      })
      .catch( () => this.next() );
    })
    .catch( () => this.next() );
      
  }

  next():void{
    
    this.file.checkFile(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
    .then((result)=>{
      this.file.readAsText(this.file.externalApplicationStorageDirectory, "ListOfProjects.txt")
      .then((data)=>{

        if(data == "")
          data = this.title + data;
        else
          data = this.title + "\r\n" + data;
        
        this.file.writeExistingFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",data);
      });
    })
    .catch((error) => {
      this.file.writeFile(this.file.externalApplicationStorageDirectory,"ListOfProjects.txt",this.title);
    });

    this.file.createFile(this.file.externalApplicationStorageDirectory, this.title + ".csv", true);

    this.navCtrl.setRoot(GooglePage,{title:this.title,records:[],flag:false});
  }

  presentToast():void {
    let toast = this.toastCtrl.create({
      message: "Project already exists.\nPlease choose a different name.",
      duration: 1000,
      position: 'middle'
    });
    toast.present();
  }
}