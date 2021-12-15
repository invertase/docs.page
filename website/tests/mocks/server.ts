import { handlers } from './handlers';
import { setupServer } from 'msw/node';
export const server = setupServer(
  // Describe the requests to mock.
  ...handlers,
);
