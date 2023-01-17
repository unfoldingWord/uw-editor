import React, { useEffect } from 'react';

// eslint-disable-next-line react/prop-types, no-unused-vars
export default function SectionHeading({ type: _type, content, show, index, verbose, ...props }) {
  useEffect(() => {
    if (verbose) console.log('SectionHeading: Mount/First Render', index);
    return (() => {
      if (verbose) console.log('SectionHeading: UnMount/Destroyed', index);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkStr = content
  const matchRes = checkStr.match(/<span class="mark.*chapter-(\d).*"/)
  const chNum = matchRes && matchRes[1] || ""
  let type = index && `Chapter ${chNum}`;
  type ||= (_type === "main") ? "Title & Introduction" : _type;

  return (
    <div className='sectionHeading' {...props}>
      <span className='expand'>
        {show ? '' : '...'}
        {type}
        {show ? '' : '...'}
      </span>
    </div>
  );
};