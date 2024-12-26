import {
	generateUploadButton,
	generateUploadDropzone,
	generateUploader
} from "@uploadthing/react";
import { OurFileRouter } from './core';


export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
export const Uploader = generateUploader<OurFileRouter>();
