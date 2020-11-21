import React, { useState, useEffect, cloneElement } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

export function LiveCode({ code }: { code: string }) {
  return (
    <div className="no-prose rounded overflow-hidden">
      <LiveProvider code={code} scope={{ useState, useEffect, cloneElement }}>
        <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">
          LIVE EDITOR
        </div>
        <div className="bg-gray-800">
          <LiveEditor />
        </div>
        <LiveError />
        <div>
          <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">
            RESULT
          </div>
          <div className="bg-gray-800 text-white">
            <LivePreview />
          </div>
        </div>
      </LiveProvider>
    </div>
  );
}

export function withCodeBlockTitle(title: string, children: React.ReactNode) {
  return (
    <>
      <div className="bg-gray-800 border-gray-700 text-white font-mono border-b px-4 py-2 rounded-tr rounded-tl text-sm font-bold">
        {title}
      </div>
      {children}
    </>
  );
}
