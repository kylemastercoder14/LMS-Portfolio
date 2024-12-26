"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.bubble.css";

import React, { useMemo } from "react";

const Preview = ({ value }: { value: string }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return <ReactQuill theme="bubble" value={value} readOnly />;
};

export default Preview;
