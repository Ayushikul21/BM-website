import React from "react";
import HtmlRenderer from "./HtmlRender";

const Registration = () => {
    // return <HtmlRenderer filePath={'/salary website/registration_form.html'}/>
    return (
    <iframe
      src="/salary website/registration_form.html"
      title="Registration"
      width="100%"
      height="1000px"
      style={{ border: 'none' }}
    />
   );
};

export default Registration;