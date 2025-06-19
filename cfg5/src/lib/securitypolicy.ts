export interface SecurityPolicyInterface {
	id: string;
	description: string;
	name: string;
	session: [any];
	tags: [];
	map: any;
}

export interface PathMapInterface {
	id: string;
	description: string;
	name: string;
	match: string;
	acl_profile: string;
	acl_profile_active: boolean;
	content_filter_profile: string;
	content_filter_profile_active: boolean;
	backend_service: string;
	edge_functions: [];
	rate_limit_rules: [];
}

export class SecurityPolicy implements SecurityPolicyInterface {
	id: string = '';
	description: string = '';
	name: string = '';
	session: [any] = [{"attr" : "ip"}]
	tags: [] = [];
	map: any;
	
	constructor(backend: string = '1.2.3.4'){
		let root = new PathMap('__root_entry__', '^/(\\W.*)?$', backend);
		let site = new PathMap('__site_level__', '__site_level__', '__default__');
		let dflt = new PathMap('__default_entry__', '/', backend);
	
		this.map = [root, site, dflt];	

	}
}

export class PathMap implements PathMapInterface {
	id: string;
	description: string = '';
	name: string;
	match: string;
	acl_profile: string = '__acldefault__';
	acl_profile_active: boolean = false;
	content_filter_profile: string = '__defaultcontentfilter__';
	content_filter_profile_active: boolean = false;
	backend_service: string;
	edge_functions: [] = [];
	rate_limit_rules: [] = [];

	constructor(id: string, path: string, backend: string){
		this.id = id;
		this.name = path.replace(/__/gi, '');
		this.match = path;
		this.description = this.name;
		this.backend_service = backend;
	}
}
