"use client";

import { useEffect, useRef, useState } from "react";

import { Textarea } from "@/components/ui/textarea";

type Props = {
  description: string;
};

export const Description = ({ description }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null!);
  const [desc, setDesc] = useState(description);

  useEffect(() => {
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [desc]);

  return (
    <Textarea
      ref={ref}
      className="mb-4 h-auto"
      value={desc}
      onChange={(e) => setDesc(e.target.value)}
    />
  );
};
