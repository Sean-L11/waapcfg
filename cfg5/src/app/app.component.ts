import { Component, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl}  from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  templateUrl: './alternate.component.html',
  styleUrl: './alternate.component.css'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('btnNext') guibtnNext!: ElementRef;
  @ViewChild('btnBack') guibtnBack!: ElementRef;
  @ViewChild('progressText') guiprgTxt!: ElementRef;
  @ViewChild('progressBar') guiprgBar!: ElementRef;
  @ViewChild('guiPhase1') guiPhase1!: ElementRef;
  @ViewChild('guiPhase2') guiPhase2!: ElementRef;
  @ViewChild('guiPhase3') guiPhase3!: ElementRef;
  @ViewChild('guiPhase4') guiPhase4!: ElementRef;
  @ViewChild('guiPhase5') guiPhase5!: ElementRef;
  @ViewChild('phaseButton1') guiPhaseButton1!: ElementRef;
  @ViewChild('phaseButton2') guiPhaseButton2!: ElementRef;
  @ViewChild('phaseButton3') guiPhaseButton3!: ElementRef;
  @ViewChild('phaseButton4') guiPhaseButton4!: ElementRef;

  @ViewChild('optLESSL') guiOptLets!: ElementRef;
  @ViewChild('optFileSSL') guiOptCert!: ElementRef;
  @ViewChild('fileSSL') guiFileSSL!: ElementRef;

  @ViewChildren('optBOT') guiOptBot!: QueryList<ElementRef>;
  @ViewChildren('optWAF') guiOptWAF!: QueryList<ElementRef>;


  guiPhaseArray: ElementRef[] = [];
  guiPhaseButtonArray: ElementRef[] = [];

  title = 'cfg5';
  service: string = '';
  apikey: string = '';
  private putconsole = true;
  private rawAcct: string | null = null;
  private rawApi: string | null = null;
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
    SSL: new FormControl('none'),
    WAF: new FormControl('Monitor'),
    BOT: new FormControl('Allow'),

    cert: new FormControl(''),
    filterAction: new FormControl('ignore'),
    GeoList: new FormControl(this.geoSelect),
    IPList: new FormControl(''),
  })

  guiPhase: number = 1;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
	this.websiteForm.disable();
	this.route.queryParams.subscribe(params => {
			this.service = params['acct'];
			this.apikey = params['apikey'];
			this.getConfig();
		});
  }

  ngAfterViewInit(): void {
	this.guiPhaseArray = new Array(
		this.guiPhase1, 
		this.guiPhase2, 
		this.guiPhase3, 
		this.guiPhase4, 
		this.guiPhase5
	);
	this.guiPhaseButtonArray = new Array(
		this.guiPhaseButton1,
		this.guiPhaseButton2,
		this.guiPhaseButton3,
		this.guiPhaseButton4
	);
  }

  url2host(url: string){
	let host: string = '';
	var urlPattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
	const match = urlPattern.exec(url);
	if (match) {host = match[2];}
	return host;
  }

  onDomainBlur(){
	const domain = this.websiteForm.get('domain')!.value;
	this.backend.resolveAddress(this.url2host(domain!)).subscribe({
		next:(response) => {
			if (response.Answer) {
				this.websiteForm.get('originIP')?.setValue(response.Answer[0].data);
			}
		},
		error:(err) => {
			if (this.putconsole) console.log('dns error',err);
		}
	});
  }

  onCertUpload(event: Event){
	const file = (event.target as HTMLInputElement).files![0];
	if (this.putconsole) console.log('file upload ', file);	
  	const reader = new FileReader();
	if (this.putconsole) console.log('reader ',reader);
	reader.onload = (e: any) => {
		const fileContent: string = e.target.result as string;
		if (this.putconsole) console.log("file content: ",fileContent);
		this.certificate.fromfile(fileContent);
		this.certificate.id = this.backend.randomID();
		if (this.putconsole) console.log("cert check ",this.certificate);
	};
	reader.onerror = (e: any) => {
		if (this.putconsole) console.log("file read error ",e);
	};
	reader.readAsText(file);
  }

  getConfig() {
	this.backend.setAuth(this.service, this.apikey);
	if (this.putconsole) console.log('auth', this.service + ":" + this.apikey);
	this.backend.getData().subscribe({
	  next:(response) => {
		  if (this.putconsole) console.log('Fetched ',response);
		  this.securitypolicy = response;
		  this.message = "Authentication Success...";
		  this.websiteForm.enable();
		  
	  },
	  error:(err) => {
		  if (this.putconsole) console.error('Fetch Error ',err)
		  this.message = "Authentication Failed...";
		  this.websiteForm.disable();
	  }
	});
	this.backend.getDNS().subscribe({
		next:(response) => {
			if (this.putconsole) console.log('dns response',response);
			for (let i = 0; i < response.dns_records.length; i++){
				let r = response.dns_records[i];
				if (r.name.substring(0,9) == 'fire-prod') {
					this.dnsResult = "Please update dns record to point to:\n "+r.name+" ( "+r.resource_records[0]+" )";
				}
			}
		},
		error:(err) => {
			if (this.putconsole) console.log('dns error',err);
		}
	});
  }

  submitConfig(submit = true) {
	let ip = 'default.ip';
	let fqdn = 'Link11 WAAP';
	let enableSSL = false;
	let leCert = false;
	let enableWAF = false;
	let enableACL = true;
	let aclProfile = '__acldefault__';
	let certid = 'placeholder';;
	if (this.putconsole) {console.log('Form Data ',this.websiteForm);}
	if (this.websiteForm.get('originIP')){
		ip = this.websiteForm.get('originIP')!.value+"";
	}
	if (this.websiteForm.get('domain')){
		fqdn = this.websiteForm.get('domain')!.value+"";
	}
	if (this.putconsole) {console.log('SSL ', this.websiteForm.get('SSL')!.value);}
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


	if (this.putconsole) {console.log('origin ',origin);}

	if (submit) {this.backend.setAuth(this.service, this.apikey);}

	if (submit) {
		this.backend.postOrigin(origin).subscribe({
		  next:(response) => {
			  if (this.putconsole) console.log('origin Response ',response);
		  },
		  error:(err) => {
			  if (this.putconsole) console.error('origin Error ',err)
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
			if (this.putconsole) console.log("Geo: ",this.websiteForm.get("GeoList")!.value);
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
			if (this.putconsole) console.log("IP", ipArray);
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

		if (this.putconsole) {console.log("global filter:", restrictionFilter);}
		if (submit) {
			this.backend.postFilter(restrictionFilter).subscribe({
				next:(response) => {
					if (this.putconsole) console.log("filter success ",response);
				},
				error:(err) => {
					if (this.putconsole) console.log("filter error ",err);
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
	if (this.putconsole) {console.log('security policy ',this.securitypolicy);}
	if (submit) {
		this.backend.postSecurityPolicy(this.securitypolicy).subscribe({
	 	  next:(response) => {
			if (this.putconsole) console.log('policy response ',response);
		  },
		  error:(err) => {
			if (this.putconsole) console.log('policy error ',err);
		  }
		});
	}
	// set server group
	var servergroup = new ServerGroup(fqdn);
	servergroup.id = this.backend.randomID();

	// apply new policy
	servergroup.security_policy = this.securitypolicy.id;
	
       	//apply ssl cert or placeholder
	if (this.putconsole) {console.log("server group ",servergroup);}
	if (submit) {
		this.backend.postServer(servergroup).subscribe({
		  next:(response) => {
			if (this.putconsole) console.log('server response ',response);
		  },
		  error:(err) => {
			if (this.putconsole) console.log('server error ',err);
		  }
		});
	}
	// set SSL
	if (enableSSL) {
		if (leCert) {
	// send le cert 
			this.backend.postLECertificate(certid, fqdn).subscribe({
				next: (response) => {
					if (this.putconsole) console.log('cert response ',response);
					this.backend.attachCertificate(certid, servergroup);
				},
				error: (err) => {
					if (this.putconsole) console.log('cert error',err);
				}	
			});
		} else {
	// upload certificate
			certid = this.certificate.id;
			this.backend.postCertificate(this.certificate, fqdn).subscribe({
				next: (response) => {
					if (this.putconsole) console.log('cert response ',response);
					this.backend.attachCertificate(certid, servergroup);	
				},
				error: (err) => {
					if (this.putconsole) console.log('cert error',err);
				}	
			});
		}
	}
	// push update
	if (submit) {
		this.backend.commit(this.service).subscribe({
		  next:(response) => {
			if (this.putconsole) console.log('commit response ', response);
		  },
		  error:(err) => {
			if (this.putconsole) console.log('commit error ',err);
		  }	  
		});
	}
	// display DNS info:
	if (submit) {
		this.backend.getDNS().subscribe({
		  next:(response) => {
			if (this.putconsole) console.log('dns response',response);
			for (let i = 0; i < response.dns_records.length; i++){
				let r = response.dns_records[i];
				if (r.name.substring(0,9) == 'fire-prod') {
					this.dnsResult = "Please update "+fqdn+" dns record to point to:\n "+r.name+" ( "+r.resource_records[0]+" )";
				}
			}
		  },
		  error:(err) => {
		  	if (this.putconsole) console.log('dns error',err);
		  }
        	});	
	}
  }  

  saveOptions() {
	this.guiOptBot.forEach((option) => {
		if (option.nativeElement.classList.contains('selected')) {
			this.websiteForm.get("BOT")!.setValue(option.nativeElement.innerHTML);
		}		  
	});
	this.guiOptWAF.forEach((option) => {
		if (option.nativeElement.classList.contains('selected')) {
			this.websiteForm.get("WAF")!.setValue(option.nativeElement.innerHTML);
		}		  
	});
  }

  guiCloseSetup() {

  }

  guiShowStep(step: number) {
	this.guiPhase = step;
	for (let p=0; p < this.guiPhaseArray.length; p++) {
		this.guiPhaseArray[p].nativeElement.classList.toggle('active', p === (step -1));
		if (p < this.guiPhaseButtonArray.length) {
			this.guiPhaseButtonArray[p].nativeElement.classList.toggle('active' , p === (step -1));
			this.guiPhaseButtonArray[p].nativeElement.classList.toggle('done', p < (step-1));
		}
	}
	this.guiprgTxt.nativeElement.innerText = step <= 4 ? 'Step '+step+'/4' : 'Complete';
	this.guiprgBar.nativeElement.style.width = ((step - 1) / 4 *100)+'%';
	this.guibtnBack.nativeElement.disabled = step === 1;
	let nb = this.guibtnNext.nativeElement;
	switch (step) {
	  case 5:
		nb.textContent = 'Close';
	  	this.submitConfig(true);
		break;
	  case 4:
		nb.textContent = 'Finish';
	        break;
	  default:
		nb.textContent = 'Next';
	  	
	}
	if (this.putconsole) console.log(step, this.websiteForm.value);
  }

  guiNextStep() { if (this.guiPhase < 5) this.guiShowStep(this.guiPhase + 1); else this.guiCloseSetup();}
  guiPrevStep() { if (this.guiPhase > 1) this.guiShowStep(this.guiPhase - 1);}

  guiOptSyncLets() {
	this.guiFileSSL.nativeElement.classList.add('hidden');
	if (this.guiOptLets.nativeElement.checked) {
		this.websiteForm.get('SSL')!.setValue('letsencrypt');
		this.guiOptCert.nativeElement.checked = false;
	} else {
		this.websiteForm.get('SSL')!.setValue('none');
	}
 }

  guiOptSyncFile() {
	if (this.guiOptCert.nativeElement.checked) {
		this.websiteForm.get('SSL')!.setValue('upload');
		this.guiFileSSL.nativeElement.classList.remove('hidden');
		this.guiOptLets.nativeElement.checked = false;
	} else {
		this.websiteForm.get('SSL')!.setValue('none');
		this.guiFileSSL.nativeElement.classList.add('hidden');
	}

  }
  guiSelectBox(oplist: any, selected: number = 0) {
	  
	  oplist.childNodes.forEach((node: HTMLElement) => {
		  node.classList.remove('selected');
	  });
	  
	  const target = oplist.childNodes[selected];
	  target.classList.add('selected');
	  this.saveOptions();

  }
}
