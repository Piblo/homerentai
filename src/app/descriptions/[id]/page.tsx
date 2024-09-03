import Image from "next/image";
import { db } from "@/server/database/connection";
import { descriptions } from "@/server/database/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function Description({ params }: Props) {
  const description = await db.query.descriptions.findFirst({
    where: eq(descriptions.id, params.id),
    with: {
      images: true,
    },
  });

  if (!description) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl mb-4">{description.title}</h2>

      <p className="text-muted-foreground max-w-[80ch] mb-4">
        {description.text}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {description.images.map((image) => (
          <Image
            key={image.id}
            className="rounded object-cover aspect-square"
            src={image.url}
            alt=""
            width={200}
            height={200}
          />
        ))}
      </div>
    </div>
  );
}
