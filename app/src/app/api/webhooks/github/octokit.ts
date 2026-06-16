import { App } from "octokit";

export const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
});

export async function getOctokitForInstallation(installationId: number) {
  return await app.getInstallationOctokit(installationId);
}