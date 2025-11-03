import { Bucket } from "encore.dev/storage/objects";

export const claimDocuments = new Bucket("claim-documents", {
  public: false,
  versioned: false,
});

export const profilePictures = new Bucket("profile-pictures", {
  public: true,
  versioned: false,
});
