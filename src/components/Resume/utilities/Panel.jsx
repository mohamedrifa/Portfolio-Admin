import React, {memo} from "react";
import SectionHead from "./SectionHead";

const Panel = memo(({ title, hint, children }) => (
  <div className="panel">
    <SectionHead title={title} hint={hint} />
    {children}
  </div>
));

export default Panel;