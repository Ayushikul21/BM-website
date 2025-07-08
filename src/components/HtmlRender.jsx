import React, { useEffect, useState } from 'react';

const HtmlRenderer = ({ filePath }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch(filePath)
      .then((res) => res.text())
      .then((data) => setHtmlContent(data))
      .catch((err) => console.error("Error loading HTML:", err));
  }, [filePath]);

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};

export default HtmlRenderer;
