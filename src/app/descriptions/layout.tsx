import { DescriptionList } from "@/components/DescriptionList";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  return (
    <main className="grid lg:grid-cols-[400px_1fr] px-6 gap-6">
      <DescriptionList className="hidden lg:block" />
      <div className="mx-auto lg:mx-0 flex-1">{children}</div>
    </main>
  );
}
