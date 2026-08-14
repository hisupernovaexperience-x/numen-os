import { EmptyState, PageHeader } from "@/components/ui";

export default function MoodboardPage() {
  return (
    <div>
      <PageHeader title="Moodboard" description="Guardá referencias visuales e inspiración." />
      <EmptyState
        icon="🎨"
        title="Todavía no hay nada en el moodboard"
        hint="Esta sección está lista para empezar a guardar tus referencias."
      />
    </div>
  );
}
