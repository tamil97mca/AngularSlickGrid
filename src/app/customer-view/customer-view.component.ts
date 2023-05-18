import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RestService } from '../rest.service';
import { map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent {

  dataObject: any;
  collectionName = 'sg_customer_records';

  avatar: any;
  attachmentUrl:any;
  // images: Array<string> = [];
  images: Array<string> = ["https://preview.ibb.co/jrsA6R/img12.jpg", "https://preview.ibb.co/kPE1D6/clouds.jpg", "https://preview.ibb.co/mwsA6R/img7.jpg", "https://preview.ibb.co/kZGsLm/img8.jpg"];

  constructor(public fb : FormBuilder, public http : HttpClient,  public activatRoute: ActivatedRoute, private restService: RestService,
    private domSanitizer: DomSanitizer) { 

      this.attachmentUrl = "assets/img/user_icon.png";
      // this.images.push("assets/img/user_icon.png")

    this.activatRoute.queryParams.subscribe(async (params) => {

      this.restService.findOne(this.collectionName, params['_id']).then(async (result:any) => {
        console.log('attach', result);
        if(result['status'] === 'success') {
          this.dataObject = result['records'];
          // this.restService.findOne(this.collectionName, params['_id']+`/${Object.keys(result.records._attachments)[0]}`).then((attach:any) => {
          //   console.log('attach', attach);
          // })
          let a = this.collectionName+'/'+params['_id']+`/${Object.keys(result.records._attachments)[0]}`

          const response:any = await this.http.get(a, { responseType: 'blob' }).toPromise();

          // Create a Blob from the response
          if (response.size > 0) {
            const blob = new Blob([response], { type: 'image/png' });
    
            // Convert the Blob to a SafeUrl          
            this.images = [];
            this.attachmentUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            console.log(this.attachmentUrl);
            this.images.push(this.attachmentUrl);
          }
        }
      })

  })

  }

  backButtonClick() {
    history.back()
  }
}





      // if (params && Object.keys(params).length > 0) {
      //     this.restService.findOne(this.collectionName, params['_id']).then((viewData:any) => {
      //       if(viewData['status'] === 'success') {
      //         this.dataObject = JSON.parse(JSON.stringify(viewData['records']));
      //         const blob = new Blob([this.dataObject['_attachments']['image']['data']], { type: this.dataObject['_attachments']['image']['content_type'] });
      //         const url = URL.createObjectURL(blob);
      //       }
      //     })

      // }