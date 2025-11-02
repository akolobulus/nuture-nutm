import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useBackend } from "../lib/useBackend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CLAIM_CATEGORIES } from "../config";

export default function SubmitClaim() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();

  const submitClaim = useMutation({
    mutationFn: async () => {
      const uploadedUrls: string[] = [];

      if (files.length > 0) {
        setUploading(true);
        for (const file of files) {
          const { uploadUrl, publicUrl } = await backend.claims.uploadUrl({
            fileName: file.name,
          });

          await fetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
          });

          uploadedUrls.push(publicUrl);
        }
        setUploading(false);
      }

      return await backend.claims.submit({
        amount: parseFloat(amount),
        description,
        category,
        receiptUrls: uploadedUrls,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully and is pending review.",
      });
      navigate("/claims");
    },
    onError: (error: Error) => {
      console.error("Submit claim error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitClaim.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Submit a Claim</CardTitle>
              <CardDescription>
                Fill out the form below to submit a new insurance claim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLAIM_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Claim Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about your medical expense..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">Receipts/Prescriptions</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
                      className="hidden"
                    />
                    <label htmlFor="files" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or PDF (max 10MB each)
                      </p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-[#00A859]" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
                  disabled={submitClaim.isPending || uploading}
                >
                  {submitClaim.isPending || uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {uploading ? "Uploading files..." : "Submitting..."}
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
