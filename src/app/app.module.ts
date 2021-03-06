import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Device } from '@ionic-native/device';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NewProjectPage } from '../pages/new-project/new-project';
import { OpenFilePage } from '../pages/open-file/open-file';
import { GooglePage } from '../pages/google/google';
import { DataModalPage } from '../pages/data-modal/data-modal';
import { ShowRecordPage } from '../pages/show-record/show-record';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    NewProjectPage,
    OpenFilePage,
    GooglePage,
    DataModalPage,
    ShowRecordPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NewProjectPage,
    OpenFilePage,
    GooglePage,
    DataModalPage,
    ShowRecordPage,
  ],
  providers: [
    File,
    Geolocation,
    AlertController,
    ToastController,
    Diagnostic,
    SocialSharing,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
