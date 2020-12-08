import React, { useState } from 'react';
import { Eye, EyeOff } from '../components/Icons';
import cx from 'classnames';

function TableOfContents(props: React.HTMLProps<HTMLDivElement>) {
  const [visible, setVisible] = useState<boolean>(true);
  return (
    <div className="mb-8">
      <div className="toc flex items-center space-x-4">
        <h3 className="">Table of contents</h3>
        <div onClick={() => setVisible($ => !$)}>
          <>
            {visible && <Eye size={20} />}
            {!visible && <EyeOff size={20} />}
          </>
        </div>
      </div>
      {!visible && <span className="text-xs">Table of Contents is hidden</span>}
      <nav {...props} className={cx('toc mb-12 text-sm', { hidden: !visible })} />
    </div>
  );
}

export { TableOfContents };
