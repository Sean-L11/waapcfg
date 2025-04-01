export interface OriginInterface {
	id: string;
	description: string;
	http11: boolean;
	least_conn: boolean;
	name: string;
	sticky: string;
	sticky_cookie_name: string;
	transport_mode: string;
	back_hosts: [any];

}

export interface BackHostInterface {
	backup: boolean;
	down: boolean;
	fail_timeout: number;
	host: string;
	http_ports: [number];
	https_ports: [number];
	max_fails: number;
	monitor_state: string;
	weight: number;
}

export class Origin implements OriginInterface {
	id: string = '';
	description: string = '';
	http11: boolean = true;
	least_conn: boolean = false;
	name: string = '';
	sticky: string = '';
	sticky_cookie_name = '';
	transport_mode: string = '';
	back_hosts: [any];
	constructor(backendIP = '3.4.30.9'){
		let backhost = new BackHost(backendIP);
		this.back_hosts = [backhost]
	}
}

export class BackHost implements BackHostInterface {
	backup: boolean = false;
	down: boolean = false;
	fail_timeout: number = 10;
	host: string; 
	http_ports: [number] = [ 80 ];
	https_ports: [number] = [ 443 ];
	max_fails: number = 3;
	monitor_state: string = '';
	weight: number = 1;
	constructor(backendIP = '3.4.30.9'){
		this.host = backendIP;
	}
}
