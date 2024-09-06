/* eslint-disable @next/next/no-img-element */
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
import { Subscription } from "@/server/database/schema";
import { compressImage } from "@/utils/image";
import { getPreSignedUrl } from "@/app/descriptions/actions";
import { useCompletion } from "ai/react";

type Image = {
  base64: string;
  file: File;
  id: string;
};

type Props = {
  subscription: Subscription;
};

export function PropertyPhotoUpload({ subscription }: Props) {
  const [images, setImages] = useState<Image[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const { completion, complete, isLoading } = useCompletion({
    onError: (error) => setError(JSON.parse(error.message).message),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const images = filesArray.map((file) => ({
      base64: URL.createObjectURL(file),
      file,
      id: crypto.randomUUID(),
    }));

    setImages((existing) => [...existing, ...images]);
  }

  function removeImage(id: string) {
    setImages(images.filter((image) => image.id !== id));
  }

  async function handleGenerateDescription() {
    if (images.length === 0) {
      setError(
        "Please upload at least one image before generating a description"
      );
      return;
    }

    if (subscription.type === "free" && images.length > 5) {
      setError("You can only upload up to 5 images with the free plan");
      return;
    }

    setError(null);

    try {
      setImageUploading(true);

      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          const compressedImage = await compressImage(image.file, 0.5);
          const { error, result } = await getPreSignedUrl(compressedImage.type);

          if (error !== undefined) {
            return;
          }

          await fetch(result.url, {
            method: "PUT",
            body: compressedImage,
            headers: {
              "Content-Type": compressedImage.type,
            },
          });

          return result.imageUrl;
        })
      );

      setImageUploading(false);

      complete("", {
        body: { images: uploadedImages, language: navigator.language },
      });
    } catch (err) {
      setImageUploading(false);
      setError(
        "An error occurred while generating the description. Please try again"
      );
    }
  }

  const loading = isLoading || imageUploading;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="mb-2">Upload property photos</CardTitle>
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
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.base64}
                      alt=""
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleGenerateDescription} disabled={loading}>
              {loading ? (
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
