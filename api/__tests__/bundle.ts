import fetch from "node-fetch";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

import domains from '../../domains.json';

const ownerRepositoryList = domains.map(([_hostname, path]) => path.split('/'))

describe('/bundle', () => {
    let serverProcess: ChildProcessWithoutNullStreams;

    beforeAll(async () => {

        serverProcess = spawn('node', ['dist/app.js']);

        await new Promise<void>(resolve => {
            function handler(data: Buffer) {

                if (data.toString("utf8").includes("is running at")) {
                    serverProcess.stdout.removeListener("data", handler)
                    resolve();
                }
            }
            serverProcess.stdout.on("data", handler)
        });
    });

    afterAll(() => {
        serverProcess.kill();
    });

    test('should return a 404 on missing owner', async () => {

        const endpoint = 'http://localhost:8000/bundle?owner=invertase&repository=doesntexist';

        const res = await fetch(endpoint);
        const data = await res.json() as any;

        expect(data.statusCode).toBe(404);
        expect(data.reason).toBe('REPO_NOT_FOUND');
        expect(data.message).toBe("Couldn't find github contents");


    });

    ownerRepositoryList.forEach(([owner, repository]) => {
        test(`should return a 200 on ${owner}/${repository} docs indexes at least`, async () => {

            if (owner !== "invertase") {
                return
            }
            const endpoint = `http://localhost:8000/bundle?owner=${owner}&repository=${repository}`;

            const res = await fetch(endpoint);


            const data = await res.json() as any;

            expect(res.status).toBe(200);

            expect(data.code).toBeDefined();
            expect(data.source).toBeDefined();
            expect(data.config).toBeDefined();


        });

    })
});
