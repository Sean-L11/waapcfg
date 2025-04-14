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
	challenge_cookie_domain: string = '$host';
	description: string = '';
	mobile_application_group: string = '';
	name: string;
	proxy_template: string = '__default__';
	routing_profile: string = '__default__';
	security_policy: string = '';
	server_names: [string];
	ssl_certificate: string = 'placeholder';
	client_certificate: string = '';
	client_certificate_mode: string = 'off';

	constructor(fqdn = "example.com"){
		this.name = fqdn;
		this.description = fqdn+" server group";
		this.server_names = [fqdn];
	}
}
