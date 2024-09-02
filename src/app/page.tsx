import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Star, UploadCloud, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-screen-md text-balance">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none mb-6">
                  Transform Your Property Listings with AI
                </h1>
                <p className="mx-auto md:text-xl text-muted-foreground">
                  Upload photos of your property and get an AI-generated
                  description in seconds. Perfect for Airbnb, Booking.com, and
                  more.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/descriptions">Get Started</Link>
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <UploadCloud className="h-8 w-8 mb-2" />
                  <CardTitle>Easy Photo Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload multiple property photos with our user-friendly
                    interface. Preview and manage your uploads effortlessly.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Wand2 className="h-8 w-8 mb-2" />
                  <CardTitle>AI-Powered Descriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your photos and generates
                    compelling, accurate property descriptions in seconds.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-8 w-8 mb-2" />
                  <CardTitle>Customizable Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Edit and refine the AI-generated descriptions to perfectly
                    match your property&apos;s unique features and style.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Photos</h3>
                <p className="text-muted-foreground">
                  Select and upload multiple photos of your property using our
                  simple interface.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes your photos to identify key features
                  and selling points.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Get Description</h3>
                <p className="text-muted-foreground">
                  Receive a professionally written description highlighting your
                  property&apos;s best attributes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Elevate Your Listings?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of property owners who are saving time and
                  attracting more guests with AI-powered descriptions.
                </p>
              </div>
              <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
