import { getPageContent } from "../../../../../utils/content";
import { checkExistence } from "../../../../../utils/debug";
import { mdxSerialize } from "../../../../../utils/mdx-serialize";
import { Properties } from "../../../../../utils/properties";

export default async function handler(req, res) {
  const {owner,name,slug} = req.query
  const path = slug ?? [''];
  const properties = await Properties.build([owner, name, slug ? path : '']);

  let existence;
  try {
    existence = await checkExistence(owner, name);
  }
  finally {
  if (!existence.owner || !existence.name || !existence.path) {
    res.status(200).josn({statusCode: 404, existence})
  }
    // Query GitHub for the content
    const content = await getPageContent(properties);

    if (content.frontmatter.redirect) {
      // Redirect the user to another page
      res.status(200).json({message: "redirect"})
    } else {
      let warnings,errors,serialization
      try {
        serialization = await mdxSerialize(content);
      }
      finally {
        warnings = serialization.warnings;
        errors = serialization.errors;
      }
      res.status(200).json({warnings,errors,statusCode:500})
  }
  res.status(200).json({message: "all good"})
  }
}