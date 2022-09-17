import type { Enemy } from "types";
import {
	MarkdownPostProcessorContext,
	parseYaml,
	Plugin
} from "obsidian";
import { StatblockRenderer } from "statblockrenderer";
import srdData from "monsters.json";
import gloranthaData from "gloranthanMonsters.json";

export default class ArchmagePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"13aG",
			this.processMarkdown.bind(this)
		);
	}

	async processMarkdown(
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	): Promise<void> {
		const enemy: Enemy = parseYaml(source);
		const allMonsters: Enemy[] = [...srdData, ...gloranthaData]

		let renderData: Enemy = { ...enemy };
		if ('monster' in enemy) {
			const lookupMonster = allMonsters.find((x) => x.name === enemy.monster);
			if (lookupMonster) {
				renderData = { ...lookupMonster, ...enemy } as Enemy;
			}
		}

		ctx.addChild(new StatblockRenderer(el, renderData));
	}

	onunload() {}
}
