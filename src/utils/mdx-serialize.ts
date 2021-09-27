import { HeadingNode, PageContent } from './content';
import { IWarning } from './warning';
import axios from 'axios';
import a2a from 'a2a';
interface SerializationResponse {
  source: string;
  headings: HeadingNode[];
  errors?: {
    line?: number;
    column?: number;
    message?: string;
    start?: number;
    end?: number;
  }[];
  warnings?: IWarning[];
}

const endpoint =
  process.env.NODE_ENV === 'production' ? 'https://bundler.docs.page' : 'http://localhost:8000';

const getToken = async () => {
  const response = await axios.post(`${endpoint}/token`, {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  });
  return response.data;
};

export async function mdxSerialize(content: PageContent): Promise<SerializationResponse> {
  // authenticate with bundle service
  const token = await getToken();
  //set headers
  const headers = {
    'Content-Type': 'text/plain',
    Authorization: `Bearer ${token}`,
  };

  const response: SerializationResponse = {
    source: null,
    errors: null,
    headings: [],
    warnings: [],
  };

  const [, res] = await a2a(
    axios.post(
      `${endpoint}/bundle?headerDepth=${content.config.headerDepth ?? 3}`,
      content.markdown,
      { headers },
    ),
  );

  response.source = res?.data?.bundled?.code;
  response.warnings = res?.data?.warnings;
  response.headings = res?.data?.headings;

  if (res?.data?.status !== 200) {
    let debug;
    try {
      debug = await axios.post(`${endpoint}/debug`, content.markdown, {
        headers,
      });
    } catch (e) {
      response.errors = res?.data?.bundled?.errors || [
        {
          column: '??',
          message: 'Undetermined Error. Check all JSX tags are closed',
          line: debug?.data?.line,
          start: debug?.data?.line,
          emd: debug?.data?.line,
          leftOver: debug?.data.leftOver || null,
        },
      ];
    }

    response.source = debug?.data?.bundled?.code;
    response.errors = res?.data?.bundled?.errors || [
      {
        column: '??',
        message: 'Undetermined Error. Check all JSX tags are closed',
        line: debug?.data?.line,
        start: debug?.data?.line,
        emd: debug?.data?.line,
        leftOver: debug?.data.leftOver || null,
      },
    ];
  }

  return response;
}
