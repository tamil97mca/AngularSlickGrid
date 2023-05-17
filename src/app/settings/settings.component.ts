import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  selectedOption!: string;

  constructor() { }

  ngOnInit(): void {
  }

  myFunction() {
    console.log(this.selectedOption);
  }

}
