"use client"; // 添加这一行
import Script from "next/script";
import { useEffect } from "react";

export default function FootScript() { 
  useEffect(() => {
   
  }, []);
  return ( 
    <>
    {/* <Script
        src="https://jsdelivr.pai233.top/gh/winterx/color4bg.js@main/build/js/BlurDotBg.min.js"
     
      />  
        <Script
        id="color4bg2"
        dangerouslySetInnerHTML={{
            __html: `new Color4Bg.BlurDotBg({
            dom: "box",
            colors: ["#A7DDBC","#8FC5AA","#78AE99","#609687"],
            loop: true
          })`,
        }}
    /> */}


<Script
        id="demo"
        dangerouslySetInnerHTML={{
            __html: `console.log("Hello,World!")`,
        }}
    /> 

  </>
  );
}
