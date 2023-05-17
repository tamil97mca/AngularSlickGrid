import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { param } from 'jquery';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-customer-entry',
  templateUrl: './customer-entry.component.html',
  styleUrls: ['./customer-entry.component.css']
})
export class CustomerEntryComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]); 
  hide = true;
  params: any;
  selectedData: any;
  files: any;
  imgURL: any;

  formGroup: FormGroup;

  constructor(public fb: FormBuilder, public http: HttpClient, public activatRoute: ActivatedRoute, private rest: RestService,
    private router: Router) {

    this.formGroup = this.fb.group({
      _id: new FormControl(''),
      _rev: new FormControl(''),
      name: new FormControl('', Validators.required),
      dob: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      avatar: new FormControl("", Validators.required)
    })


    this.activatRoute.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length > 0) {
        this.params = JSON.parse(JSON.stringify(params));
        // let selectedData =
        this.params['selectedData'] = JSON.parse(params['selectedData']);
        if (this.params['action'] === 'edit') {

          this.formGroup.patchValue(this.params.selectedData);

        } else if (this.params['action'] === 'clone') {

          this.formGroup.patchValue(this.params.selectedData);

        }
      }
    })


  }

  ngOnInit() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const selectedFile: any = document.getElementById('selectedFile');
    const previewImage = document.getElementById('preview') as HTMLImageElement; // Type assertion

    fileInput.addEventListener('change', (event: any) => {
      const fileName = event.target.files[0].name;
      selectedFile.textContent = `Selected File: ${fileName}`;

      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        // Read the file as Data URL
        reader.readAsDataURL(fileInput.files[0]);

        // Set the preview image source to the Data URL
        reader.onload = function (event: any) {
          const image = event.target.result as string; // Type assertion
          previewImage.src = image;
        }
      }  else {
        // Reset the preview image source if no file is selected
        previewImage.src = '#';
      }

    });

  }

  backButtonClick() {
    history.back()
  }

  submit() {
    let url = '/sg_customer_records/';
    delete this.formGroup.value.avatar;
    console.warn("formGroup values...", this.formGroup.value);

    if (this.params && this.params['action'] === 'edit') {

      this.rest.updateOne(url, this.formGroup.value._id, this.formGroup.value).then((res: any) => {
        console.log("save result", res);

        let imgData = { _id: res.records.id, _rev: res.records.rev, image: this.files }
        this.rest.updateImg('sg_customer_records', imgData).then((res: any) => {

          console.log("put img", res);
        });
      })

      this.formGroup.reset();
      this.router.navigate(["/list"], {skipLocationChange: true});

    }
    else {
      delete this.formGroup.value._id;
      delete this.formGroup.value._rev;
      this.rest.save(url, this.formGroup.value).then((res: any) => {
        console.log("save result", res);

        let imgData = { _id: res.records.id, _rev: res.records.rev, image: this.files }
        this.rest.updateImg('sg_customer_records', imgData).then((res: any) => {

          console.log("put img", res);
        });
        this.formGroup.reset();
        this.router.navigate(["/list"], {skipLocationChange: true});
      });
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  backButton() {
    history.back()
  }

  onSelect(event: any) {
    console.log(event);
    this.files = event.target.files[0];
    console.log(this.files);
  }

}
