import { ImageCell as ImageCell_cc6ba7a67a750306cf80099ab7d2fdd8 } from "@/fields/image/components/image-cell"
import { SlugField as SlugField_2b8867833a34864a02ddf429b0728a40 } from "@payloadcms/next/client"
import { CollectionCards as CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1 } from "@payloadcms/next/rsc"
import { S3ClientUploadHandler as S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24 } from "@payloadcms/storage-s3/client"
import { default as default_df11bb316907791f5fb03b4c26a3565f } from "../../../fields/active/components/active-cell"

/** @type import('payload').ImportMap */
export const importMap = {
  "/fields/active/components/active-cell#default":
    default_df11bb316907791f5fb03b4c26a3565f,
  "@payloadcms/next/client#SlugField":
    SlugField_2b8867833a34864a02ddf429b0728a40,
  "@/fields/image/components/image-cell#ImageCell":
    ImageCell_cc6ba7a67a750306cf80099ab7d2fdd8,
  "@payloadcms/storage-s3/client#S3ClientUploadHandler":
    S3ClientUploadHandler_f97aa6c64367fa259c5bc0567239ef24,
  "@payloadcms/next/rsc#CollectionCards":
    CollectionCards_f9c02e79a4aed9a3924487c0cd4cafb1,
}
