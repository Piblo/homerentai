"use client";

import { Check, Clipboard } from "lucide-react";

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
    <Button className="mb-4" onClick={onClick}>
      {!isCopied && <Clipboard size={16} className="mr-2" />}
      {isCopied && <Check size={16} className="mr-2" />}
      Copy description
    </Button>
  );
};
