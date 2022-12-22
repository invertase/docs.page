import { ImageResponse } from '@vercel/og';
import Image from './image';

export const config = {
  runtime: 'edge',
};

export default function (_req: Request) {
  return new ImageResponse(Image(), {
    width: 1200,
    height: 600,
  });
}
