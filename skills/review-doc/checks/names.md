# names

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### product-spelling

- **Scan:** product and feature names
- **Finding if:** capitalization does not match the publisher's official form; or a product name is used as a verb; or *the* sits before a product name that is not modifying another noun
- **Skip if:** the publisher's established spelling on this site

### filenames

- **Scan:** backtick filenames in prose
- **Finding if:** no *file* / *directory* / *path* noun (*`docs.json`* vs *the `docs.json` file*); or a new filename uses spaces or mixed case instead of lowercase hyphens
- **Skip if:** an existing directory already uses underscores — match that convention

### example-hosts

- **Scan:** hostnames, emails, and people in examples
- **Finding if:** the domain is not clearly fake (`example.com` / `.org` / `.net`); or the example uses real PII
- **Skip if:** `EMAIL_ADDRESS`-style placeholders
