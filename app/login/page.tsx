import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const googleEnabled = !!process.env.GOOGLE_CLIENT_ID;
  const magicLinkEnabled = !!process.env.EMAIL_SERVER;

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Numen</h1>
          <p className="text-sm text-muted mt-1">Iniciá sesión para ver tu dashboard.</p>
        </div>
        <LoginForm googleEnabled={googleEnabled} magicLinkEnabled={magicLinkEnabled} />
      </div>
    </div>
  );
}
