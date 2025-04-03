import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

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
  // need to use local URL - use nginx to proxy to xyz.app.reblaze.io
  private headers = new HttpHeaders();

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

}
