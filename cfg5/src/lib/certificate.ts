import * as pkijs from 'pkijs';

export interface CertificateInterface {
	name: string;
	cert_body: string;
	expires: string;
	id: string;
	issuer: string;
	le_auto_renew: boolean;
	le_auto_replace: boolean;
	le_hash: string;
	private_key: string;
	san: [];
	subject: string;
	uploaded: string;
	revoked: boolean;
	crl: [];
	cdp: [];
	side: string;
	links: [];

}

export class Certificate implements CertificateInterface{
	name: string;
	cert_body: string;
	expires: string;
	id: string;
	issuer: string;
	le_auto_renew: boolean;
	le_auto_replace: boolean;
	le_hash: string;
	private_key: string;
	san: [];
	subject: string;
	uploaded: string;
	revoked: boolean;
	crl: [];
	cdp: [];
	side: string;
	links: [];

	constructor(){}

	validate(){}

	import(){}
}
