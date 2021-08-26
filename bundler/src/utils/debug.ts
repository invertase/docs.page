/* eslint-disable @typescript-eslint/no-explicit-any */

import { bundle } from "./bundle.js";
import { setupXdmOptions } from "./xdm-options.js";

export function insertCodeBlock(mdx: string,start : number,end : number) {
  const lines : string[] = mdx.split('\n')
  lines.splice(Math.max(start-1,0),0,'\`\`\`')
  lines.splice(Math.min(end+1,lines.length),0,'\`\`\`')
  return lines.join('\n')
}


export async function incrementalDebug(mdx: string, line : number) {
  console.log('LINE',line);
  const xdmOptionsSetup = setupXdmOptions;

  const lines = mdx.split('\n')
  let start = lines.length
  
  while (start > 0) {
    const isolated = insertCodeBlock(mdx,start,lines.length)
    console.log(isolated.split('\n'),start,lines.length);
    
    const attempt = await bundle(isolated,xdmOptionsSetup);
    if (attempt.status === 200) {
      console.log('start',start);
      console.log(attempt?.bundled?.code);
      
      return {bundled: attempt, line: start -1}
    }
    start = start -1;
  }
}