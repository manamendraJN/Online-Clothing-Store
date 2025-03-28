import React from 'react';
import "../button.css";

export default function button() {
  return (
    <div>
      <button className="learn-more">
  <span className="circle" aria-hidden="true">
  <span className="icon arrow"></span>
  </span>
  <span className="button-text"> <div className=' ml-5'>Shopping Now</div></span>
</button>
    </div>
  )
}
