export interface ArrayResponseInterface {
	total: number;
	items: [any];
}

export class ArrayResponse implements ArrayResponseInterface {
	total: number = 0;
	items: [any] = [null];

	constructor(){
	}
}
