import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl}  from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Origin, BackHost } from '../lib/origin';
import { SecurityPolicy, PathMap } from '../lib/securitypolicy';
import { ServerGroup } from '../lib/servergroup';
import { ApiService } from './api.service';
import { Certificate } from '../lib/certificate';
import { CountryList } from '../lib/countrylist';
import { Filter } from '../lib/filter';

@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cfg5';
  service = '';
  apikey = '';
  backend = inject(ApiService);
  private securitypolicy: SecurityPolicy = new SecurityPolicy();
  countryList: any = new CountryList();
  geoSelect = [];
  message: any;
  dnsResult: any;
  certificate: any = new Certificate();
  websiteForm = new FormGroup({
    domain: new FormControl('your.domain.here', [Validators.required, Validators.pattern('.+')]),
    originIP: new FormControl('1.2.3.4', [Validators.required, Validators.pattern('.+')]),
    SSL: new FormControl(''),
    WAF: new FormControl(''),
    BOT: new FormControl(''),

    cert: new FormControl(''),
    filterAction: new FormControl(''),
//    GeoList: new FormControl(this.countryList),
    GeoList: new FormControl(this.geoSelect),
    IPList: new FormControl(''),
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
	//this get LB provider / regioni
  }


  submitConfig(submit = true) {
	let putconsole = false;
	  // set origin
	let ip = 'default.ip';
	let fqdn = 'Link11 WAAP';
	let enableSSL = false;
	let leCert = false;
	let enableWAF = false;
	let enableACL = true;
	let aclProfile = '__acldefault__';
	let certid = 'placeholder';;
	if (putconsole) {console.log('Form Data ',this.websiteForm);}
	if (this.websiteForm.get('originIP')){
		ip = this.websiteForm.get('originIP')!.value+"";
	}
	if (this.websiteForm.get('domain')){
		fqdn = this.websiteForm.get('domain')!.value+"";
	}
	if (putconsole) {console.log('SSL ', this.websiteForm.get('SSL')!.value);}
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


	if (putconsole) {console.log('origin ',origin);}

	if (submit) {this.backend.setAuth(this.service, this.apikey);}

	if (submit) {
		this.backend.postOrigin(origin).subscribe({
		  next:(response) => {
			  console.log('origin Response ',response);
		  },
		  error:(err) => {
			  console.error('origin Error ',err)
		  }
		});
	}
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
//Global filter restrictions for Geo / IP
	if (this.websiteForm.get("filterAction")!.value != "ignore") {	
		let restrictionFilter = new Filter();
		restrictionFilter.id = this.backend.randomID();
		restrictionFilter.description = "Global " +this.websiteForm.get("filterAction")!.value + " list";
		restrictionFilter.rule.entries = [];
		restrictionFilter.name = restrictionFilter.description + " ("+fqdn+")"
		//for GEO
		if (this.websiteForm.get("GeoList")!.value && this.websiteForm.get("GeoList")!.value!.length > 0) {
			console.log("Geo: ",this.websiteForm.get("GeoList")!.value);
			for (const country of this.websiteForm.get("GeoList")!.value!) {
				restrictionFilter.rule.entries.push([
					"country", 
					country, 
					this.websiteForm.get("filterAction")!.value + " " + country
				]);
		
			}
		}
		//for each IP
		if (this.websiteForm.get("IPList")!.value && this.websiteForm.get("IPList")!.value!.length > 0) {
			let ipArray: string[] = this.websiteForm.get("IPList")!.value!.split('\n');
			console.log("IP", ipArray);
		        for (const addr of ipArray) {	
				restrictionFilter.rule.entries.push([
					"ip", 
					addr, 
					this.websiteForm.get("filterAction")!.value + " " + addr
			])
			}
		}
		switch (this.websiteForm.get("filterAction")!.value) {
			case "block":
		// Global filter tag deny specific country / IP
				restrictionFilter.tags = [
					"global-acl-enforce-deny",
					"enforce-acl-deny"
				]
				restrictionFilter.active = true;
				break;
			case "allow": 
		// Global filter tag allow specific country / IP
				restrictionFilter.tags = [
					"global-acl-bypass",
					"global-acl-bypass-all",
					"global-content-filter-ignore"
				]
				restrictionFilter.active = true;
				break;
		}

		if (putconsole) {console.log("global filter:", restrictionFilter);}
		if (submit) {
			this.backend.postFilter(restrictionFilter).subscribe({
				next:(response) => {
					console.log("filter success ",response);
				},
				error:(err) => {
					console.log("filter error ",err);
				}
			})
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
	if (putconsole) {console.log('security policy ',this.securitypolicy);}
	if (submit) {
		this.backend.postSecurityPolicy(this.securitypolicy).subscribe({
	 	  next:(response) => {
			console.log('policy response ',response);
		  },
		  error:(err) => {
			console.log('policy error ',err);
		  }
		});
	}
	// set server group
	var servergroup = new ServerGroup(fqdn);
	servergroup.id = this.backend.randomID();

	// apply new policy
	servergroup.security_policy = this.securitypolicy.id;
	
       	//apply ssl cert or placeholder
//	servergroup.ssl_certificate = certid;	
	
	if (putconsole) {console.log("server group ",servergroup);}
	if (submit) {
		this.backend.postServer(servergroup).subscribe({
		  next:(response) => {
			console.log('server response ',response);
		  },
		  error:(err) => {
			console.log('server error ',err);
		  }
		});
	}
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
	if (submit) {
		this.backend.commit(this.service).subscribe({
		  next:(response) => {
			console.log('commit response ', response);
		  },
		  error:(err) => {
			console.log('commit error ',err);
		  }	  
		});
	}
	// display DNS info:
	//
	//
	if (submit) {
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
}
