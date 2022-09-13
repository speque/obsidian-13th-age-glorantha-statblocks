import type { Enemy } from "types";
import {
	MarkdownPostProcessorContext,
	parseYaml,
	Plugin
} from "obsidian";
import { StatblockRenderer } from "statblockrenderer";
import srdData from "monsters.json";

export default class ArchmagePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			"13a",
			this.processMarkdown.bind(this)
		);
	}

	async processMarkdown(
		source: string,
		el: HTMLElement,
		ctx: MarkdownPostProcessorContext
	): Promise<void> {
		const yaml: Enemy = parseYaml(source);
		let renderData: Enemy = { ...yaml };

		if (yaml.monster) {
			const lookupMonster = srdData.find((x) => x.name === yaml.monster);
			if (lookupMonster) {
				renderData = { ...lookupMonster, ...yaml };
			}
		}

		ctx.addChild(new StatblockRenderer(el, renderData));
	}

	onunload() {}
}
