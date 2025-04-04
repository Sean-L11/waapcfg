import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { Origin, BackHost } from './origin';
import { SecurityPolicy, PathMap } from './securitypolicy';
import {ServerGroup} from './servergroup';
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
  private securitypolicy: SecurityPolicy = new SecurityPolicy();
  message: any;
//  apiService: ApiService;
  websiteForm = new FormGroup({
    domain: new FormControl('example.com', [Validators.required, Validators.pattern('.+')]),
    originIP: new FormControl('5.6.7.8', [Validators.required, Validators.pattern('.+')]),
  })

//  constructor(private apiService: ApiService){}
  contructor() {}

  getConfig() {
	this.backend.setAuth(this.service, this.apikey);
	this.backend.getData().subscribe({
	  next:(response) => {
		  console.log('Fetched ',response);
		  this.securitypolicy = response;
	  },
	  error:(err) => {
		  console.error('Error ',err)

	  }
	});
  }

  submitConfig() {
	  // set origin
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

	this.backend.postOrigin(origin).subscribe({
	  next:(response) => {
		  console.log('Response ',response);
	  },
	  error:(err) => {
		  console.error('Error ',err)
	  }
	});

	  // change backend on new policy
	this.securitypolicy.id = this.backend.randomID();
	for (let i = 0; i < this.securitypolicy.map.length; i++){
		if (this.securitypolicy.map[i].id != '__site_level__') {
			this.securitypolicy.map[i].backend_service = origin.id;
		}
	}
	this.securitypolicy.name = fqdn+" Security Policy";
	console.log('security policy ',this.securitypolicy);
	this.backend.postSecurityPolicy(this.securitypolicy).subscribe({
	  next:(response) => {
		console.log('response ',response);
	  },
	  error:(err) => {
		console.log('error ',err);
	  }
	});

	  // set server group
	var servergroup = new ServerGroup(fqdn);
	servergroup.id = this.backend.randomID();
	  // apply new policy
	servergroup.security_policy = this.securitypolicy.id;
	  // remove default site level
	console.log("server group ",servergroup);
	this.backend.postServer(servergroup).subscribe({
	  next:(response) => {
		console.log('response ',response);
	  },
	  error:(err) => {
		console.log('error ',err);
	  }
	});
	  // upload SSL cert
	  //
	  // apply cert to LB - make default
	  
  }  
}
