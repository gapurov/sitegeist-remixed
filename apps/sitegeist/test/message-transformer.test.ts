import { expect, test } from "bun:test";
import { browserMessageTransformer } from "../src/messages/message-transformer.ts";

type TransformerInput = Parameters<typeof browserMessageTransformer>[0];

test("keeps document attachments in the LLM payload", async () => {
	const messages = [
		{
			role: "user-with-attachments",
			content: "Please read it",
			timestamp: 1,
			attachments: [
				{
					id: "att-1",
					type: "document",
					fileName: "note.txt",
					mimeType: "text/plain",
					size: 11,
					content: "aGVsbG8gd29ybGQ=",
					extractedText: "hello world",
				},
			],
		},
	] as const;

	const output = await browserMessageTransformer(messages as unknown as TransformerInput);

	expect(output).toHaveLength(1);
	expect(JSON.stringify(output)).toContain("hello world");
});

test("keeps image attachments in the LLM payload", async () => {
	const messages = [
		{
			role: "user-with-attachments",
			content: "",
			timestamp: 1,
			attachments: [
				{
					id: "img-1",
					type: "image",
					fileName: "dot.png",
					mimeType: "image/png",
					size: 3,
					content: "AAEC",
					preview: "AAEC",
				},
			],
		},
	] as const;

	const output = await browserMessageTransformer(messages as unknown as TransformerInput);

	expect(output).toHaveLength(1);
	expect(JSON.stringify(output)).toContain("image/png");
});

test("still strips accidental attachment metadata from plain user messages", async () => {
	const messages = [
		{
			role: "user",
			content: "plain message",
			timestamp: 1,
			attachments: [{ unexpected: true }],
		},
	] as const;

	const output = await browserMessageTransformer(messages as unknown as TransformerInput);

	expect(output).toHaveLength(1);
	expect(Object.hasOwn(output[0], "attachments")).toBe(false);
});
