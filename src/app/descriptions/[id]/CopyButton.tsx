"use client";

import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";

type Props = {
  description: string;
};

export const CopyButton = ({ description }: Props) => {
  function onClick() {
    navigator.clipboard.writeText(description);
    toast("Description copied to clipboard");
  }

  return (
    <Button className="mb-4" onClick={onClick}>
      <Clipboard size={16} className="mr-2" />
      Copy description
    </Button>
  );
};
