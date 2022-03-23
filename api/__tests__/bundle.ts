import fetch from "node-fetch";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";

import domains from '../../domains.json';

const ownerRepositoryList = domains.map(([_hostname, path]) => path.split('/'))

describe('/bundle', () => {
    let serverProcess: ChildProcessWithoutNullStreams;

    beforeAll(async () => {
        serverProcess = spawn('node', ['dist/app.js']);
        // Give it enough time to start:
        await new Promise(resolve => setTimeout(resolve, 2000))
    })

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


        await new Promise(resolve => setTimeout(resolve, 4000))

    });

    ownerRepositoryList.forEach(([owner, repository]) => {
        test(`should return a 200 on invertase docs indexes at least`, async () => {

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


            await new Promise(resolve => setTimeout(resolve, 4000))

        });

    })
});
