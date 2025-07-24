import * as x509 from '@peculiar/x509';

export interface CertificateInterface {
	name: string;
	cert_body: string;
	exp_date: string;
	id: string;
	issuer: string;
	le_auto_renew: boolean;
	le_auto_replace: boolean;
	le_hash: string;
	private_key: string;
	san: any;
	subject: string;
	revoked: boolean;
	crl: any;
	cdp: any;
	side: string;
	provider_links: any;

}

export class Certificate implements CertificateInterface{
	name: string = '';
	cert_body: string = 'placeholder';
	exp_date: string = '';
	id: string = '';
	issuer: string= '';
	le_auto_renew: boolean = false;
	le_auto_replace: boolean = false;
	le_hash: string = '';
	private_key: string = '';
	san: any;
	subject: string = '';
	revoked: boolean = false;
	crl: any;
	cdp: any;
	side: string = 'server';
	provider_links: any;

	constructor(subject: string = 'Default'){
		this.name = subject + " Certificate";
		this.id = '';
		let n = Date.now();
		let d = new Date(n);

	}

	validate(){}

	fromfile(certstring: string){
		try {
			let priv_key = certstring.indexOf("-----BEGIN RSA PRIVATE KEY-----");
			this.cert_body = certstring.substr(0,priv_key);
			this.private_key = certstring.substr(priv_key, certstring.length);

			let cert = new x509.X509Certificate(certstring);
			this.subject = cert.subject;
			this.issuer = cert.issuer;
			// exp_date must be midnight
			let re = /T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z/g;
			this.exp_date = cert.notAfter.toISOString().replace(re, "T00:00:00.000Z");
		} catch (error) {

		}
	}
}
