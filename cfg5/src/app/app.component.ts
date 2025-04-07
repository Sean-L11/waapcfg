import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { Origin, BackHost } from '../lib/origin';
import { SecurityPolicy, PathMap } from '../lib/securitypolicy';
import {ServerGroup} from '../lib/servergroup';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cfg5';
  service = 'v5demo';
  apikey = 'L7rOxY78SK2-XpL7dsGipWcCJ818DRWE6xGfjB2eiheQcjLnEHUxXfqrGil9K405';
//  backend = inject(OriginService);
  backend = inject(ApiService);
  private securitypolicy: SecurityPolicy = new SecurityPolicy();
  message: any;
  dnsResult: any;
  certificate: any = null;
//  apiService: ApiService;
  websiteForm = new FormGroup({
    domain: new FormControl('example.com', [Validators.required, Validators.pattern('.+')]),
    originIP: new FormControl('5.6.7.8', [Validators.required, Validators.pattern('.+')]),
    cert: new FormControl('LE',[Validators.required]),
  })

  contructor(fb: FormBuilder) {
  }

  ngOnInit() {
	this.websiteForm.disable();
  }

  onCertUpload(event: Event){
	const file = (event.target as HTMLInputElement).files![0];
	console.log('file upload ', file);	
  }

  getConfig() {
	this.backend.setAuth(this.service, this.apikey);
	this.backend.getData().subscribe({
	  next:(response) => {
		  console.log('Fetched ',response);
		  this.securitypolicy = response;
		  this.message = "Authentication Success...";
		  this.websiteForm.enable();
		  
	  },
	  error:(err) => {
		  console.error('Error ',err)
		  this.message = "Authentication Failed...";
		  this.websiteForm.disable();
	  }
	});
  }

  submitConfig() {

	  // set origin
	let ip = 'default.ip';
	let fqdn = 'example.com';
	let enableSSL = false;
	if (this.websiteForm.get('originIP')){
		ip = this.websiteForm.get('originIP')!.value+'';
	}
	if (this.websiteForm.get('domain')){
		fqdn = this.websiteForm.get('domain')!.value+'';
	}

	if (this.websiteForm.get('cert')){
		enableSSL = this.websiteForm.get('cert')!.value == "LE";
	}
	const origin = new Origin(ip);
	origin.id = this.backend.randomID();
	origin.name = fqdn+" backend";
	origin.description = "Backend Service for "+fqdn;

	// set SSL
	if (enableSSL) {
	
	//

	}

	console.log('origin ',origin);

	this.backend.setAuth(this.service, this.apikey);

	this.backend.postOrigin(origin).subscribe({
	  next:(response) => {
		  console.log('origin Response ',response);
	  },
	  error:(err) => {
		  console.error('origin Error ',err)
	  }
	});

	  // change backend on new policy
	this.securitypolicy.id = this.backend.randomID();
	  // preserve default site level backend
	for (let i = 0; i < this.securitypolicy.map.length; i++){
		if (this.securitypolicy.map[i].id != '__site_level__') {
			this.securitypolicy.map[i].backend_service = origin.id;
		}
	}
	this.securitypolicy.name = fqdn+" Security Policy";
	console.log('security policy ',this.securitypolicy);
	this.backend.postSecurityPolicy(this.securitypolicy).subscribe({
	  next:(response) => {
		console.log('policy response ',response);
	  },
	  error:(err) => {
		console.log('policy error ',err);
	  }
	});

	  // set server group
	var servergroup = new ServerGroup(fqdn);
	servergroup.id = this.backend.randomID();
	  // apply new policy
	servergroup.security_policy = this.securitypolicy.id;
	console.log("server group ",servergroup);
	this.backend.postServer(servergroup).subscribe({
	  next:(response) => {
		console.log('server response ',response);
	  },
	  error:(err) => {
		console.log('server error ',err);
	  }
	});
	// upload SSL cert
	//
	// apply cert to LB - make default
	//
	// push update
	
	this.backend.commit(this.service).subscribe({
	  next:(response) => {
		console.log('commit response ', response);
	  },
	  error:(err) => {
		console.log('commit error ',err);
	  }	  
	});
	// display DNS info:
	//
	//
	this.backend.getDNS().subscribe({
	  next:(response) => {
		console.log('dns response',response);
		for (let i=0; i<response.dns_records.length; i++){
			let r = response.dns_records[i];
			if (r.name.substring(0,9) == 'fire-prod'){
				this.dnsResult = "Please update "+fqdn+" dns record to point to:\n "+r.name+" ( "+r.resource_records[0]+" )";
			}
		}
	  },
	  error:(err) => {
	  	console.log('dns error',err);
	  }
        });	
  }  
}
