import { getPageContent } from '../../../../../utils/content';
import { checkExistence } from '../../../../../utils/debug';
import { mdxSerialize } from '../../../../../utils/mdx-serialize';
import { Properties } from '../../../../../utils/properties';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IWarning } from '../../../../../utils/warning';

type Data = {
  existence: { owner: string; name: string; path: string };
  statusCode: number;
  warnings?: IWarning;
  errors: {
    line?: number;
    column?: number;
    message?: string;
    start?: number;
    end?: number;
    src?: string;
  }[];
};
const defaultRes = {
  existence: { owner: 'yes', name: 'yes', path: 'yes' },
  statusCode: 199,
  errors: null,
  warnings: null,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
): Promise<void> {
  let { owner, name, slug } = req.query;
  owner = owner.toString();
  name = name.toString();
  if (!Array.isArray(slug)) {
    slug = [slug];
  }

  const properties = await Properties.build([owner, name, ...slug]);

  let existence;
  try {
    existence = await checkExistence(owner, name);
  } finally {
    if (!existence.owner || !existence.name || !existence.path) {
      res.status(200).json(defaultRes);
    }
    // Query GitHub for the content
    const content = await getPageContent(properties);

    if (content.frontmatter.redirect) {
      // Redirect the user to another page
      res.status(200).json(defaultRes);
    } else {
      let warnings, errors, serialization;
      try {
        serialization = await mdxSerialize(content);
      } finally {
        warnings = serialization.warnings;
        errors = serialization.errors;
      }
      res.status(200).json({
        existence: { owner: 'yes', name: 'yes', path: 'yes' },
        statusCode: 199,
        errors,
        warnings,
      });
    }
  }
}
