import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
// import PouchDB from 'pouchdb';
// import PouchFind from 'pouchdb-find';

// PouchDB.plugin(PouchFind);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'Angular-Slick-Grid';

  last_seq = 'now';
  db: any;
  remote: any;

  constructor(public http: HttpClient, public router : Router, public dialog: MatDialog) {

    if (navigator.onLine) {
      console.log("online");
    } else {
      alert("offline");
    }

    window.addEventListener("offline", (e) => {
      alert("offline");
    });

    window.addEventListener("online", (e) => {
      alert("online");
    });


    // let url = '/sg_customer_records/_changes?'+change;
    // this.http.get(url).subscribe((result: any) => {
    //   console.log("Changes triggered...", result);
    //   this.last_seq = result.last_seq;
    // })
  }

  layoutNavigation(navigationURL: string) {

    this.router.navigate([navigationURL], {skipLocationChange: true});

  }

  ngOnInit() {

    this.remote = "https://apikey-v2-1xzbb618xtgfg14nm7uasm9coajsc9dzzpg8p57atbtg:f56766c5716a7b37a531aaa7bdb53315@8ca8138b-1aac-430a-8325-3a686242a515-bluemix.cloudantnosqldb.appdomain.cloud" + '/sg_customer_records/'
    // this.remote = 'https://8ca8138b-1aac-430a-8325-3a686242a515-bluemix.cloudantnosqldb.appdomain.cloud'+'/sg_customer_records/'

    // this.db = new PouchDB(this.remote, { auth: { username: 'apikey-v2-1xzbb618xtgfg14nm7uasm9coajsc9dzzpg8p57atbtg', password: 'f56766c5716a7b37a531aaa7bdb53315'}});

    // this.db.change({ live: true, continuous: true, since: this.last_seq, timeout: 30000, include_docs: true, attachments: true }).on('change', (res:any) => {
    //   console.log("Change listener...", res);
    // })

  }

  settingDialog() {
    const dialogRef = this.dialog.open(SettingsComponent, {
      width: 'fit-content',
      height: '400px',
      panelClass: 'dialog-container',
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true
    });
  }

}
