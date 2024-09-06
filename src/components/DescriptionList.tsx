"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Button } from "./ui/button";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserDescriptions } from "@/actions/descriptions";
import { useParams } from "next/navigation";
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

  const { id } = useParams();

  return (
    <div className={cn("flex flex-col h-full items-start mt-6", className)}>
      <Button asChild className="mb-4 w-full" variant="secondary">
        <Link href="/descriptions" onClick={onGenerateNewClick}>
          <Sparkles size={16} className="mr-2" />
          Generate new
        </Link>
      </Button>
      <ScrollArea className="flex-1">
        <ul className="space-y-4">
          {data?.map((description) => (
            <li key={description.id}>
              <Link
                href={`/descriptions/${description.id}`}
                className="group"
                onClick={onDescriptionClick}
              >
                <Card
                  className={cn("group-hover:bg-muted group-focus:bg-muted", {
                    "bg-muted": id === description.id,
                  })}
                >
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
      </ScrollArea>
    </div>
  );
}
