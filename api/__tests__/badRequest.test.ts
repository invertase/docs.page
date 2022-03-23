import fetch from "node-fetch";

describe('github', () => {
    test('should return a 400 on missing owner', async () => {
        console.log('test ran');
        const endpoint = 'http:localhost:8000/bundle?owner=invertase&repository=doesntexist';

        const res = await fetch(endpoint);
        const data = await res.json();
    });
});
