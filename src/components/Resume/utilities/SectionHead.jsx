import React from "react";

const SectionHead = ({ title, hint }) => (
  <div className="panel__head">
    <h3>{title}</h3>
    {hint ? <div className="panel__hint" dangerouslySetInnerHTML={{ __html: hint }} /> : null}
  </div>
);

export default SectionHead;