import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, FormControl}  from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Origin, BackHost } from '../lib/origin';
import { SecurityPolicy, PathMap } from '../lib/securitypolicy';
import { ServerGroup } from '../lib/servergroup';
import { ApiService } from './api.service';
import { Certificate } from '../lib/certificate';

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
  backend = inject(ApiService);
  private securitypolicy: SecurityPolicy = new SecurityPolicy();
  message: any;
  dnsResult: any;
  certificate: any = new Certificate();
  websiteForm = new FormGroup({
    domain: new FormControl('example.com', [Validators.required, Validators.pattern('.+')]),
    originIP: new FormControl('3.4.30.9', [Validators.required, Validators.pattern('.+')]),
    SSL: new FormControl(''),
    WAF: new FormControl(''),
    BOT: new FormControl(''),

    cert: new FormControl(''),
  })

  contructor(fb: FormBuilder) {
  }

  ngOnInit() {
	this.websiteForm.disable();
  }

  onCertUpload(event: Event){
	const file = (event.target as HTMLInputElement).files![0];
	console.log('file upload ', file);	
  	const reader = new FileReader();
	console.log('reader ',reader);
	reader.onload = (e: any) => {
		const fileContent: string = e.target.result as string;
		console.log("file content: ",fileContent);
		this.certificate.fromfile(fileContent);
		this.certificate.id = this.backend.randomID();
		console.log("cert check ",this.certificate);
	};
	reader.onerror = (e: any) => {
		console.log("file read error ",e);
	};
	reader.readAsText(file);
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
	let leCert = false;
	let enableWAF = false;
	let enableACL = true;
	let aclProfile = '__acldefault__';
	let certid = 'placeholder';;
	console.log('Form Data ',this.websiteForm);
	if (this.websiteForm.get('originIP')){
		ip = this.websiteForm.get('originIP')!.value+"";
	}
	if (this.websiteForm.get('domain')){
		fqdn = this.websiteForm.get('domain')!.value+"";
	}
	console.log('SSL ', this.websiteForm.get('SSL')!.value);
	if (this.websiteForm.get('SSL')) { 
		switch (this.websiteForm.get('SSL')!.value){
			case "letsencrypt":
				leCert = true;
				enableSSL = true;
				certid = this.backend.randomID();
				break;
			case "upload":
				leCert = false;	
				enableSSL = true;
				certid = this.backend.randomID();
				break;
			case "none": 
			default:
				enableSSL = false;
				break;
		}
	}

	const origin = new Origin(ip);
	origin.id = this.backend.randomID();
	origin.name = fqdn+" backend";
	origin.description = "Backend Service for "+fqdn;


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

	if (this.websiteForm.get('WAF')) { 
		switch (this.websiteForm.get('WAF')!.value){
			case "Block":
				enableWAF = true;
				break;
			case "Monitor": 
			default:
				enableWAF = false;
				break;
		}
	}
	
	//bot managemnet enabled = default ACL, disabled = No Challende
	if (this.websiteForm.get('BOT')) { 
		switch (this.websiteForm.get('BOT')!.value){
			case "Challenge":
				aclProfile = '__acldenybot__';
				enableACL = true;
				break;
			case "Allow": 
			default:
				aclProfile = '__acldefault__';
				enableACL = false;
				break;
		}
	}
	  // change backend on new policy
	this.securitypolicy.id = this.backend.randomID();
	  // preserve default site level backend
	for (let i = 0; i < this.securitypolicy.map.length; i++){
		//cannot update site level location
		if (this.securitypolicy.map[i].id != '__site_level__') {
			this.securitypolicy.map[i].backend_service = origin.id;
			this.securitypolicy.map[i].acl_profile = aclProfile;
			this.securitypolicy.map[i].acl_profile_active = enableACL;
			this.securitypolicy.map[i].content_filter_profile_active = enableWAF;

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
	
       	//apply ssl cert or placeholder
//	servergroup.ssl_certificate = certid;	
	
	console.log("server group ",servergroup);
	this.backend.postServer(servergroup).subscribe({
	  next:(response) => {
		console.log('server response ',response);
	  },
	  error:(err) => {
		console.log('server error ',err);
	  }
	});
	// apply cert to LB - make default
	//
	// set SSL
	if (enableSSL) {
		if (leCert) {
	// send le cert 
			this.backend.postLECertificate(certid, fqdn).subscribe({
				next: (response) => {
					console.log('cert response ',response);
					this.backend.attachCertificate(certid, servergroup);
				},
				error: (err) => {
					console.log('cert error',err);
				}	
			});
		} else {
	// upload certificate
			certid = this.certificate.id;
			this.backend.postCertificate(this.certificate, fqdn).subscribe({
				next: (response) => {
					console.log('cert response ',response);
					this.backend.attachCertificate(certid, servergroup);	
				},
				error: (err) => {
					console.log('cert error',err);
				}	
			});
		}
	//
	}
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
