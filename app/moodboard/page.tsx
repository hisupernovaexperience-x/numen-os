import { EmptyState, PageHeader } from "@/components/ui";
import { ImageIcon } from "@/components/icons";

export default function MoodboardPage() {
  return (
    <div>
      <PageHeader title="Moodboard" description="Imágenes y referencias que te inspiran." />
      <EmptyState icon={<ImageIcon className="size-8" />} title="Módulo en construcción" hint="Acá vas a poder armar tableros visuales. Todavía no tiene funcionalidad." />
    </div>
  );
}
