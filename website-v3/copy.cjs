const fs = require('fs');

async function copy() {
  if (!process.env.VERCEL) {
    return;
  }

  fs.copyFileSync('../domains.json', './domains.json');
}

copy();
