import type { ButtonHTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] p-4 ${className}`}
    >
      {children}
    </div>
  );
}

const buttonVariants = {
  primary: "bg-foreground text-background hover:opacity-90",
  ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-foreground",
  danger: "bg-transparent text-red-600 dark:text-red-400 hover:bg-red-600/10",
} as const;

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="block text-xs font-medium text-foreground/70 mb-1" {...props} />;
}

const fieldClass =
  "w-full rounded-lg border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-foreground/30";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClass} {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldClass} resize-none`} {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClass} {...props} />;
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 rounded-xl border border-dashed border-black/15 dark:border-white/15 py-14 px-4">
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="font-medium">{title}</p>
      <p className="text-sm text-foreground/60 max-w-xs">{hint}</p>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-foreground/60 mt-1">{description}</p>
    </div>
  );
}
