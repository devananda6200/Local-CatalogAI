import Link from "next/link";
import { Brand } from "@/components/brand";
import { AuthForm } from "@/components/auth/auth-form";

export function AuthShell({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signUp = mode === "sign-up";
  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Brand />
          <div className="mt-14">
            <p className="text-sm font-bold tracking-[.18em] text-[#176b4d] uppercase">
              {signUp ? "Start in minutes" : "Welcome back"}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-[-.04em]">
              {signUp ? "Create your catalog." : "Continue building."}
            </h1>
            <p className="mt-3 leading-7 text-[#66736b]">
              {signUp
                ? "Turn your business into a storefront customers can open from anywhere."
                : "Manage your products, publish updates, and share your business."}
            </p>
          </div>
          <AuthForm mode={mode} />
          <p className="mt-7 text-center text-sm text-[#66736b]">
            {signUp ? "Already have an account?" : "New to LocalCatalog?"}{" "}
            <Link
              href={signUp ? "/sign-in" : "/sign-up"}
              className="font-bold text-[#176b4d] underline underline-offset-4"
            >
              {signUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
      <section className="noise hidden bg-[#17201b] p-10 text-white lg:flex lg:items-end">
        <div className="max-w-xl p-8">
          <div className="flex -space-x-3">
            {["AM", "RK", "NS"].map((label, index) => (
              <span
                key={label}
                className="grid size-11 place-items-center rounded-full border-2 border-[#17201b] bg-[#f0a75c] text-xs font-black text-[#17201b]"
                style={{ transform: `rotate(${index * 5 - 5}deg)` }}
              >
                {label}
              </span>
            ))}
          </div>
          <blockquote className="balance mt-8 text-3xl leading-tight font-black tracking-[-.03em]">
            “Our menu went from a WhatsApp photo dump to something we’re proud
            to share.”
          </blockquote>
          <p className="mt-5 text-sm text-white/55">
            Sample owner story · Kochi
          </p>
        </div>
      </section>
    </main>
  );
}
