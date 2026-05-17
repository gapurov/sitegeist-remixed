import type { AgentMessage } from "@mariozechner/pi-agent-core";
import type { ImageContent, Message, TextContent } from "@mariozechner/pi-ai";
import type { Attachment } from "@mariozechner/pi-web-ui";
import type { NavigationMessage } from "./NavigationMessage.js";

type UserMessageWithAttachments = AgentMessage & {
	role: "user-with-attachments";
	content: string | (TextContent | ImageContent)[];
	timestamp: number;
	attachments?: Attachment[];
};

// Helper: Check if a message has toolCall blocks
function hasToolCalls(msg: Message): boolean {
	if (msg.role !== "assistant") return false;
	return msg.content.some((block) => block.type === "toolCall");
}

// Helper: Get all toolCall IDs from an assistant message
function getToolCallIds(msg: Message): Set<string> {
	const ids = new Set<string>();
	if (msg.role !== "assistant") return ids;

	for (const block of msg.content) {
		if (block.type === "toolCall") {
			ids.add(block.id);
		}
	}
	return ids;
}

// Helper: Check if a toolResult message matches the given tool call IDs
function isToolResultFor(msg: Message, toolCallIds: Set<string>): boolean {
	if (msg.role !== "toolResult") return false;
	return toolCallIds.has(msg.toolCallId);
}

function isUserMessageWithAttachments(msg: AgentMessage): msg is UserMessageWithAttachments {
	return (msg as { role?: string }).role === "user-with-attachments";
}

function convertAttachmentsToContent(attachments: Attachment[]): (TextContent | ImageContent)[] {
	const content: (TextContent | ImageContent)[] = [];
	for (const attachment of attachments) {
		if (attachment.type === "image") {
			content.push({
				type: "image",
				data: attachment.content,
				mimeType: attachment.mimeType,
			});
		} else if (attachment.type === "document" && attachment.extractedText) {
			content.push({
				type: "text",
				text: `\n\n[Document: ${attachment.fileName}]\n${attachment.extractedText}`,
			});
		}
	}
	return content;
}

function convertUserMessageWithAttachments(message: UserMessageWithAttachments): Message {
	const content: (TextContent | ImageContent)[] =
		typeof message.content === "string" ? [{ type: "text", text: message.content }] : [...message.content];

	if (message.attachments) {
		content.push(...convertAttachmentsToContent(message.attachments));
	}

	return {
		role: "user",
		content,
		timestamp: message.timestamp,
	} as Message;
}

// Reorder messages so assistant tool calls are immediately followed by their tool results
// This moves navigation and other user messages after the tool results
function reorderMessages(messages: Message[]): Message[] {
	const result: Message[] = [];
	let i = 0;

	while (i < messages.length) {
		const msg = messages[i];

		if (msg.role === "assistant" && hasToolCalls(msg)) {
			// Found assistant with tool calls
			result.push(msg);
			i++;

			// Collect tool call IDs from this assistant message
			const toolCallIds = getToolCallIds(msg);

			// Scan forward and collect messages until next assistant or end
			const toolResultMessages: Message[] = [];
			const otherMessages: Message[] = [];

			while (i < messages.length && messages[i].role !== "assistant") {
				const nextMsg = messages[i];

				if (isToolResultFor(nextMsg, toolCallIds)) {
					toolResultMessages.push(nextMsg);
				} else {
					otherMessages.push(nextMsg);
				}
				i++;
			}

			// Add tool result messages first, then other messages (like nav)
			result.push(...toolResultMessages);
			result.push(...otherMessages);
		} else {
			// Not an assistant with tool calls, just add it
			result.push(msg);
			i++;
		}
	}

	return result;
}

// Custom message transformer for browser extension
// Handles navigation messages and app-specific message types
export async function browserMessageTransformer(messages: AgentMessage[]): Promise<Message[]> {
	const transformed: Message[] = [];

	for (const m of messages) {
		// Filter out UI-only messages
		if (m.role === "artifact" || m.role === "welcome") {
			continue;
		}

		if (m.role === "navigation") {
			const nav = m as NavigationMessage;
			const tabInfo = nav.tabId !== undefined ? ` (tab id: ${nav.tabId})` : "";

			// Use cached skills output (formatted at message creation time)
			const skillsInfo = nav.skillsOutput;

			transformed.push({
				role: "user",
				content: `<browser-context>
✓ Navigation succeeded: ${nav.title}${tabInfo}
✓ URL: ${nav.url}
</browser-context>

<skills>
${skillsInfo}
</skills>

<instructions>
- DO NOT STOP - This is informational only. CONTINUE IMMEDIATELY with the next step of your multi-step workflow. This message does NOT mean you should wait for user input.
- DO NOT REPEAT THIS MESSAGE BACK TO THE USER!
</instructions>`,
			} as Message);
		} else if (isUserMessageWithAttachments(m)) {
			transformed.push(convertUserMessageWithAttachments(m));
		} else if (m.role === "user") {
			const { attachments: _attachments, ...rest } = m as Message & { attachments?: unknown };
			transformed.push(rest as Message);
		} else if (m.role === "assistant" || m.role === "toolResult") {
			transformed.push(m as Message);
		}
	}

	return reorderMessages(transformed);
}
