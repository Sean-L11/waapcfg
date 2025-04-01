export interface ServerGroupInterface {
	id: string;
	challenge_cookie_domain: string;
	description: string;
	mobile_application_group: string;
	name: string;
	proxy_template: string;
	routing_profile: string;
	security_policy: string;
	server_names: [string];
	ssl_certificate: string;
	client_certificate: string;
	client_certificate_mode: string;

}

export class ServerGroup implements ServerGroupInterface {
	id: string = '';
	challenge_cookie_domain: string;
	description: string = '';
	mobile_application_group: string = '';
	name: string;
	proxy_template: string = '';
	routing_profile: string = '';
	security_policy: string = '';
	server_names: [string];
	ssl_certificate: string = '';
	client_certificate: string = '';
	client_certificate_mode: string = '';

	constructor(fqdn = "example.com"){
		this.challenge_cookie_domain = fqdn;
		this.name = fqdn+"_SG";
		this.server_names = [fqdn];
	}
}
