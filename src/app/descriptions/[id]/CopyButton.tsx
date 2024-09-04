"use client";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

type Props = {
  description: string;
};

export const CopyButton = ({ description }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  function onClick() {
    navigator.clipboard.writeText(description);
    toast("Description copied to clipboard");
    setIsCopied(true);
  }

  return (
    <Button onClick={onClick}>
      {!isCopied && <Copy className="mr-2 size-4" />}
      {isCopied && <Check className="mr-2 size-4" />}
      Copy description
    </Button>
  );
};
