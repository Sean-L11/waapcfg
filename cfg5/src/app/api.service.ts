import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ArrayResponseInterface } from '../lib/arrayresponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  server = '45.154.205.148';
  port = '8443';
  protocol = 'http';
  private rootURI = this.protocol+'://'+this.server+':'+this.port+'/api/v4.0/conf/prod/';
  private targetURI =  '';
  private originURI = this.rootURI+'backend-services';
  private sgURI = this.rootURI+'server-groups';
  private spURI = this.rootURI+'security-policies';
  private getURI = this.rootURI+'security-policies/__default__';
  private certURI = this.rootURI+'certificates';
  private lbURI = this.rootURI+'load-balancers';
  private filterURL = this.rootURI+'global-filters';
  private pushURI = this.protocol+'://'+this.server+':'+this.port+'/api/v4.0/tools/publish/prod';
  private dnsURI = this.protocol+'://'+this.server+':'+this.port+'/api/v4.0/tools/dns-information';
  
  // need to use local URL - use nginx to proxy to xyz.app.reblaze.io
  private headers = new HttpHeaders()

  constructor(private http: HttpClient) { 
	
	this.addHeader('accept', 'application/json');
  }
  
  randomID(){
	let myuuid = uuidv4();
	myuuid = myuuid.replace(/-/gi, '').substr(0,12);
	return myuuid;
  }

  setAuth(site = '', token = '') {
	this.addHeader('XAccount', site);  
  	this.addHeader('Authorization','Basic '+token);
  }

  addHeader(header = '', value = '', apppend = false) {
  	this.headers = this.headers.set(header, value);
  }

  getData(): Observable<any>{
	return this.http.get(this.getURI, { headers : this.headers });
  }

  postFilter(payload: any): Observable<any> {
	let id = payload.id;
	return this.http.post(this.filterURL+'/'+id, payload, { 'headers': this.headers});

  }

  postOrigin(payload: any): Observable<any> {
	let id = payload.id;	
	return this.http.post(this.originURI+'/'+id, payload, { 'headers': this.headers});

  }

  postServer(payload: any): Observable<any> {
	let id = payload.id;
	return this.http.post(this.sgURI+'/'+id, payload, { 'headers': this.headers});
  }

  postSecurityPolicy(payload: any): Observable<any> {
        let id = payload.id;
	return this.http.post(this.spURI+'/'+id, payload, { 'headers': this.headers});
  }

  postLECertificate(certid: any, domain: any): Observable<any> {
	let payload = {
  id: certid,
  le_auto_renew: true,
  le_auto_replace: true,
  le_hash: "",
  provider_links: []
};
	return this.http.post(this.certURI+'/'+payload.id + '?domains='+domain, payload, { 'headers': this.headers});
	
  }
  postCertificate(payload: any, domain: any): Observable<any> {
        let id = payload.id;
	return this.http.post(this.certURI+'/'+id + '?domains='+domain, payload, { 'headers': this.headers});
  }

  attachCertificate(certid: any, servergroup: any) {
	servergroup.ssl_certificate = certid;
//	let RR: ArrayResponse = new ArrayResponse();
	this.http.put(this.sgURI+'/'+servergroup.id, servergroup, { 'headers': this.headers}).subscribe({
		next: (response) => {
			console.log('update server ',response);
		},
		error: (err) => {
			console.log('update server ',err);
		}
	});
	this.http.get<ArrayResponseInterface>(this.lbURI, { 'headers': this.headers}).subscribe({
		next: (response) => {
			//RR = response; 
			console.log('LB GET ',response);
			let entryname = response.items[0]!.name; 
			let listener = response.items[0].listener_name;
			this.http.put(this.lbURI+'/'+entryname+'/certificates/'+certid+'?provider=gcp&region=global&default=true&listener='+listener+'&listener-port=443', null, { 'headers': this.headers}).subscribe({
				next: (response) => {
					console.log('LB PUT ',response);
				},
				error: (err) => {
					console.log('LB PUT ',err);
				}	
			});
		},
		error: (err) => {
			console.log('LB GET ',err);
		}

	});
  }

  commit(account: string): Observable<any> {
	let update: [{ name: string, url: string }];
	update = [{ name: "prod", url: "gs://rbz-"+account+"-config/prod" }];
	console.log('commit ',update);
	return this.http.put(this.pushURI, update, { 'headers': this.headers });

  }
  getDNS(): Observable<any> {
	return this.http.get(this.dnsURI, {'headers' : this.headers });
  }
}
