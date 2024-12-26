"use client";
import { toast } from "sonner";
import { ourFileRouter } from "../lib/core";
import { UploadDropzone } from "../lib/upload";

import React from "react";

const FileUpload = ({
  onChange,
  endpoint,
}: {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err) => {
        toast.error(err?.message || "Upload failed");
      }}
    />
  );
};

export default FileUpload;
