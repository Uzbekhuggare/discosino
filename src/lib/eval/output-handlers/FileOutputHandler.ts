import type { BufferResolvable } from "discord.js";
import type { EvalPayload } from "../types";
import { EvalOutputHandler } from "./EvalOutputHandler";

export class FileOutputHandler extends EvalOutputHandler {
	public override handle(payload: EvalPayload) {
		const files: File[] = [
			{
				name: "input.js",
				attachment: Buffer.from(this.formatCode(payload.code))
			},
			{
				name: "output.js",
				attachment: Buffer.from(payload.result)
			},
			{
				name: "type.ts",
				attachment: Buffer.from(payload.type)
			}
		];

		for (const { attachment } of files) {
			if (attachment.length > 8e6) {
				payload.message ??= "One or more files exceeded the 8 MB size limit.";

				return super.handle(payload);
			}
		}

		const body = "I've sent the output as files.";

		return { content: this.buildContent(body, payload.message), files };
	}
}

interface File {
	name: string;
	attachment: BufferResolvable;
}
