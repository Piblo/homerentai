"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { Sparkles } from "lucide-react";
import { getUserDescriptions } from "@/actions/descriptions";
import { useQuery } from "@tanstack/react-query";

type Props = {
  className?: string;
  onDescriptionClick?: () => void;
  onGenerateNewClick?: () => void;
};

export function DescriptionList({
  className,
  onDescriptionClick = () => {},
  onGenerateNewClick = () => {},
}: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["descriptions"],
    queryFn: () => getUserDescriptions(),
  });

  return (
    <div className={className}>
      <Button asChild className="mb-4">
        <Link href="/descriptions" onClick={onGenerateNewClick}>
          <Sparkles size={16} className="mr-2" />
          Generate new
        </Link>
      </Button>
      <ul className="space-y-4">
        {data?.map((description) => (
          <li key={description.id}>
            <Link
              href={`/descriptions/${description.id}`}
              className="group"
              onClick={onDescriptionClick}
            >
              <Card className="group-hover:bg-muted group-focus:bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {description.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="line-clamp-1 md:line-clamp-2">
                    {description.text}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
        {isLoading && (
          <>
            <Skeleton className="w-full h-[120px]" />
            <Skeleton className="w-full h-[120px]" />
            <Skeleton className="w-full h-[120px]" />
          </>
        )}
      </ul>
    </div>
  );
}
