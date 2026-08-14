import { EmptyState, PageHeader } from "@/components/ui";
import { NoteIcon } from "@/components/icons";

export default function NotesPage() {
  return (
    <div>
      <PageHeader title="Notas" description="Tu espacio libre para anotar ideas, pensamientos y cosas sueltas." />
      <EmptyState icon={<NoteIcon className="size-8" />} title="Módulo en construcción" hint="Acá vas a poder crear y organizar notas rápidas. Todavía no tiene funcionalidad." />
    </div>
  );
}
