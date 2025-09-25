import React, { useState } from 'react';

const ReadMoreLess = ({ text = "", limit = 100 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLongText = text.length > limit;
  const visibleText = expanded ? text : text.slice(0, limit) + (isLongText ? '...' : '');

  return (
    <div>
      <p style={{ marginBottom: '0.5rem' }}>
        <span dangerouslySetInnerHTML={{ __html: visibleText || "No description provided." }} />
      </p>
      {isLongText && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            color: '#007bff',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ReadMoreLess;
