import { Bucket } from "encore.dev/storage/objects";

// Bucket for storing claim receipts and prescriptions
export const claimDocuments = new Bucket("claim-documents", {
  public: false,
  versioned: false,
});
