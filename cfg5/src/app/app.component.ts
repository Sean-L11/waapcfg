import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { Origin, BackHost } from './origin';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cfg5';
  service = 'v5demo.app.reblaze.io';
  apikey = 'L7rOxY78SK2-XpL7dsGipWcCJ818DRWE6xGfjB2eiheQcjLnEHUxXfqrGil9K405';
//  backend = inject(OriginService);
  backend = inject(ApiService);

  message: any;
//  apiService: ApiService;
  websiteForm = new FormGroup({
    domain: new FormControl('example.com', [Validators.required, Validators.pattern('.+')]),
    originIP: new FormControl('5.6.7.8', [Validators.required, Validators.pattern('.+')]),
  })

  constructor(private apiService: ApiService){}

  getConfig() {
	console.log('test');
	this.message = this.backend.randomID();
	this.backend.setAuth(this.service, this.apikey);
	this.backend.getData().subscribe({
	  next:(response) => {
		  console.log('Fetched ',response);
		  for (let i=0;i<response.items.length; i++){
			this.message = this.message+" "+response.items[i].name;
		  }
	  },
	  error:(err) => {
		  console.error('Error ',err)

	  }
	});
  }

  submitConfig() {
	  // set origin
	  //
	let ip = 'default.ip';
	let fqdn = 'example.com';
	if (this.websiteForm.get('originIP')){
		ip = this.websiteForm.get('originIP')!.value+'';
	}
	if (this.websiteForm.get('domain')){
		fqdn = this.websiteForm.get('domain')!.value+'';
	}
	const origin = new Origin(ip);
	origin.id = this.backend.randomID();
	origin.name = fqdn+" backend";
	origin.description = "Backend Service for "+fqdn;

	this.message = origin.back_hosts[0].host;
	console.log('origin ',origin);

	this.backend.setAuth(this.service, this.apikey);

	this.backend.postOrigin(origin.id, origin).subscribe({
	  next:(response) => {
		  console.log('Response ',response);
		  for (let i=0;i<response.items.length; i++){
			this.message = this.message+" "+response.items[i].name;
		  }
	  },
	  error:(err) => {
		  console.error('Error ',err)

	  }
	});
	  // copy default security policy
	  //
	  // change backend on new policy
	  //
	  // set server group
	  //
	  // apply new policy
	  //
	  // upload SSL cert
	  //
	  // apply cert to LB - make default
	  
  }  
}
