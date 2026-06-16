import { App } from "octokit";

let app: App | undefined;

function getApp() {
  if (app) {
    return app;
  }

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error(
      "GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY environment variables are required.",
    );
  }

  app = new App({ appId, privateKey });
  return app;
}

export async function getOctokitForInstallation(installationId: number) {
  return await getApp().getInstallationOctokit(installationId);
}
