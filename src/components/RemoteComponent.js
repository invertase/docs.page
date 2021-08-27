import { createRemoteComponent, createRequires } from '@paciolan/remote-component';
import { resolve } from '../../remote-component.config';

const requires = createRequires(resolve);

export const RemoteComponent = createRemoteComponent({ requires });
