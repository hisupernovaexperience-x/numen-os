import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Creá tu cuenta</h1>
          <p className="text-sm text-muted mt-1">Tus datos quedan guardados de forma segura y privada.</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
