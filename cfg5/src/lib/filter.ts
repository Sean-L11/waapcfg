export interface ruleInterface {
	relation: string;
	entries: string[];
}

export interface filterInterface {
	action: string;
	active: boolean;
	description: string;
	id: string;
	name: string;
	rule: any;
	source: string;
	tags: string[];
}

export class Filter implements filterInterface {
	action: string = "action-monitor";
	active: boolean = false;
	description: string = "";
	id: string = "";
	name: string = "";
	rule: any;
	source: string = "self-managed";
	tags: string[] = [""];

	constructor(action = "", target = "", comment = "") {
		this.rule = { relation: "OR", entries: [[action, target, comment]]}
	}
}

