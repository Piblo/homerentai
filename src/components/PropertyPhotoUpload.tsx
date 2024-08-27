"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCompletion } from "ai/react";

export function PropertyPhotoUpload() {
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { completion, complete, isLoading } = useCompletion();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prevPreviews) => [
            ...prevPreviews,
            reader.result as string,
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleGenerateDescription = async () => {
    if (images.length === 0) {
      setError(
        "Please upload at least one image before generating a description."
      );
      return;
    }

    setError(null);

    try {
      complete("", { body: { images, language: navigator.language } });
    } catch (err) {
      setError(
        "An error occurred while generating the description. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Upload property photos</CardTitle>
          <CardDescription>
            Upload photos of your property to generate a description for your
            Airbnb or Booking.com listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Property photos</Label>
              <Input
                id="picture"
                type="file"
                className="dark:file:text-foreground"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleGenerateDescription} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Description"
              )}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </CardContent>
        {completion && (
          <CardFooter>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Generated Description:
              </h3>
              <p>{completion}</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
