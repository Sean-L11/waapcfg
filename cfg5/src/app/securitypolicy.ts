export interface SecurityPolicyInterface {
	id: string;
	name: string;
	session: [any];
	tags: [];
	map: any;
}

export interface PathMapInterface {
	id: string;
	name: string;
	match: string;
	acl_profile: string;
	acl_profile_active: boolean;
	content_filter_profile: string;
	content_filter_profile_active: boolean;
	backend_service: string;
	edge_functions: [];
	rate_limit_functions: [];
}

export class SecurityPolicy implements SecurityPolicyInterface {
	id: string = '';
	name: string = '';
	session: [any] = [{"attr" : "ip"}]
	tags: [] = [];
	map: any;
	
	constructor(backend: string = '1.2.3.4'){
		let root = new PathMap('__root_entry__', '^/(\\W.*)?$', backend);
		let site = new PathMap('__site_level__', '__site_level__', backend);
		let dflt = new PathMap('__default_entry__', '/', backend);
	
		this.map = [root, site, dflt];	

	}
}

export class PathMap implements PathMapInterface {
	id: string;
	name: string;
	match: string;
	acl_profile: string = '__acl_default__';
	acl_profile_active: boolean = false;
	content_filter_profile: string = '__defaultcontentfilter__';
	content_filter_profile_active: boolean = false;
	backend_service: string;
	edge_functions: [] = [];
	rate_limit_functions: [] = [];

	constructor(id: string, path: string, backend: string){
		this.id = id;
		this.name = path.replace(/__/gi, '');
		this.match = path;
		this.backend_service = backend;
	}
}
