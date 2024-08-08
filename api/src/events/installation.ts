import type { EmitterWebhookEvent } from "@octokit/webhooks";

export async function onInstallation(
	event: EmitterWebhookEvent<"installation">,
) {
	// TODO: Send a new installation event to analytics
	console.log("Installation event received", event.payload);
}
