export type Trait = {
  name: string;
  description: string;
	runes?: string[];
};

export type Attack = {
	tag?: string;
	type?: string;
	name: string;
	attack?: string;
	detail?: string;
	hit: string;
	extras?: Trait[];
};

export type Enemy = {
	source?: string;
	name: string;
	blurb?: string;
	tag: string;
	initiative: number;
	vuln?: string;
	attacks: Attack[];
	traits: Trait[];
	specials: Trait[];
	freeFormAbilities?: Trait[];
	ac: number;
	pd: number;
	md: number;
	hp: number;
	level: number;
	size?: string;
	role: string;
	runes?: string[]
	monster?: string;
}

export type EnemyRef = {
	monster: string;
}
