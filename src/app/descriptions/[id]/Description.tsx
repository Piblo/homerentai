"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateDescription } from "@/actions/descriptions";
import { useMutation } from "@tanstack/react-query";

type Props = {
  id: string;
  description: string;
};

export const Description = ({ id, description }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null!);
  const [desc, setDesc] = useState(description);
  const mutation = useMutation({
    mutationFn: updateDescription,
    onSuccess: () => toast("Description updated successfully"),
  });

  useEffect(() => {
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight + "px";
  }, [desc]);

  return (
    <div className="mb-4 space-y-4">
      <Textarea
        ref={ref}
        className="h-auto"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <Button
        disabled={desc === description}
        variant="outline"
        onClick={() =>
          mutation.mutate({
            id,
            text: desc,
          })
        }
      >
        {mutation.isPending ? (
          <LoaderCircle className="size-4 animate-spin mr-2" />
        ) : (
          <Save className="size-4 mr-2" />
        )}
        Save changes
      </Button>
    </div>
  );
};
