import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private rootURI = '';
  private targetURI =  '';
  private getURI = 'http://45.154.205.148:8443/api/v4.0/conf/prod/backend-services';
  // need to use local URL - use nginx to proxy to xyz.app.reblaze.io
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) { 
	
	this.addHeader('accept', 'application/json');
  }

  setAuth(site = '', token = '') {
	this.addHeader('XAccount', site);  
  	this.addHeader('Authorization','Basic '+token);
  }

  addHeader(header = '', value = '', apppend = false) {
  	this.headers = this.headers.set(header, value);
  }

  getData(): Observable<any>{
	console.log('headers ',this.headers);
	return this.http.get(this.getURI, { headers : this.headers });
  }

  postOrigin(payload: any): Observable<any> {
	
	return this.http.post(this.targetURI, payload, { 'headers': this.headers});

  }
}
