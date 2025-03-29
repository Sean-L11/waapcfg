import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
//import { OriginService } from './origin.service';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'cfg5';
  service = 'v5demo.app.reblaze.io';
  apikey = 'L7rOxY78SK2-XpL7dsGipWcCJ818DRWE6xGfjB2eiheQcjLnEHUxXfqrGil9K405';
//  backend = inject(OriginService);
  backend = inject(ApiService);
  message: any;
//  apiService: ApiService;
  websiteForm = new FormGroup({
    domain: new FormControl('', [Validators.required, Validators.pattern('.*')]),
    origin: new FormControl('', [Validators.required, Validators.pattern('.*')]),
  })

  constructor(private apiService: ApiService){}

  getConfig() {}
  ngOnInit() {
//	this.apiService: new ApiService();
	console.log('test');
	this.apiService.setAuth(this.service, this.apikey);
	this.apiService.getData().subscribe({
	  next:(response) => {
		  this.message = response;
		  console.log('Fetched ',this.message);
	  },
	  error:(err) => {
		  console.error('Error ',err)

	  }
	});
  }

  submitConfig() {
  }  
}
