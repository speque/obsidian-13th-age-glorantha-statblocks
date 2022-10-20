import type { Enemy, Attack, Trait } from "types"
import { MarkdownRenderChild } from "obsidian";

const runesMap = new Map<string, string>([
	["chaos", "?"],
	["truth", "y"],
	["darkness", "o"],
	["undead", "u"],
	["air", "g"],
	["death", "t"]
]);

export class StatblockRenderer extends MarkdownRenderChild {
	statblockEl: HTMLDivElement;

	constructor(containerEl: HTMLElement, private params: Enemy) {
		super(containerEl);

		this.statblockEl = this.containerEl.createDiv({ cls: "statblock-13a" });

		this.statblockEl.createDiv({ cls: "fl-r em", text: params.source });
		const title = this.statblockEl.createEl("h1", { cls: "sc nomargin", text: params.name });
		if (params.runes) {
			title.createSpan({ cls: "rune", text: ` ${convertRunes(params.runes)}`});
		}

		if (params.blurb) {
			this.statblockEl.createDiv({ cls: "em", text: params.blurb });
		}

		if (params.freeFormAbilities?.length > 0) {
			for (const ability of params.freeFormAbilities) {
				this.renderSimpleItem(ability, 'Free-form ability');
			}
		}

		if (this.roleText !== undefined) {
			const role = this.statblockEl.createDiv({ cls: "nomargin" });
			role.createSpan({ cls: "em", text: this.roleText });
			if (params.tag) {
				role.createSpan({ cls: "sc", text: ` [${params.tag}]` });
			}
		}

		if (params.initiative !== undefined) {
			this.statblockEl.createDiv({
				text: `Initiative: ${bonus(params.initiative)}`,
				cls: params.vuln ? "nomargin" : undefined,
			});
		}
		if (params.vuln !== undefined) {
			this.statblockEl.createDiv({
				text: `Vulnerability: ${params.vuln}`,
			});
		}

		for (const attack of params.attacks || []) {
			this.renderAttack(attack);
		}
		for (const trait of params.traits || []) {
			this.renderSimpleItem(trait);
		}

		if (params.specials?.length > 0) {
			this.statblockEl.createEl("h2", { text: "Nastier Specials" });
			for (const special of params.specials) {
				this.renderSimpleItem(special);
			}
		}

		const numbers = this.statblockEl.createDiv({ cls: "numbers" });
		const defenses = numbers.createDiv();
		defenses.createDiv({ cls: "bold", text: `AC ${params.ac}` });
		defenses.createDiv({ text: `PD ${params.pd}` });
		defenses.createDiv({ text: `MD ${params.md}` });
		numbers.createDiv({ cls: "bold", text: `HP ${params.hp}` });
		numbers.createDiv("");
	}

	get roleText(): string | undefined {
		if (this.params.level === undefined) return undefined;

		const ordinalRules = new Intl.PluralRules("en", { type: "ordinal" });
		const suffixes = {
			zero: "th",
			one: "st",
			two: "nd",
			few: "rd",
			other: "th",
			many: "th",
		};
		const suffix = suffixes[ordinalRules.select(this.params.level)];
		const nth = `${this.params.level}${suffix}`;

		return capitalize(
			[this.params.size, `${nth} level`, this.params.role]
				.join(" ")
				.trim()
		);
	}

	renderAttack(attack: Attack) {
		const attackEl = this.statblockEl.createDiv({ cls: "attack" });
		if (attack.tag) {
			attackEl.createSpan({ cls: "em", text: `[${attack.tag}] ` });
		}
		const titleParts = [
			attack.type === "ranged" ? "R:" : "",
			attack.type === "close" ? "C:" : "",
			attack.name,
			attack.attack,
			attack.detail ? `(${attack.detail})` : "",
		];
		attackEl.createSpan({ cls: "bold", text: titleParts.join(" ").trim() });
		attackEl.createSpan({ text: ` — ${attack.hit}` });

		for (const extra of attack.extras ?? []) {
			const div = attackEl.createDiv();
			div.createSpan({ cls: "em", text: `${extra.name}: ` });
			div.createSpan({ text: extra.description });
		}
	}

	renderSimpleItem(trait: Trait, category?: string) {
		const traitEl = this.statblockEl.createDiv();
		const prefix = category ? `${category} - ` : ''
		traitEl.createSpan({ cls: "em", text: `${prefix}${trait.name}: ` });
		traitEl.createSpan({ text: trait.description });
		if (trait.runes) {
			const runes = traitEl.createSpan({ cls: "rune", text: `${convertRunes(trait.runes)} `});
			traitEl.prepend(runes);
		}
	}
}

function capitalize(str: string): string {
	const lower = str.toLowerCase();
	return lower[0].toUpperCase() + lower.slice(1);
}

function convertRunes(runes: string[]): string {
	return runes.map(r => runesMap.get(r)).join("");
}

function bonus(stat: number | string): string {
	if (stat === 0) return stat.toString();
	return stat > 0 ? `+${stat}` : `${stat}`;
}
