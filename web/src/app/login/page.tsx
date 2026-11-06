"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciais invalidas");
        return;
      }
      // Redirect by role
      const role = data.role as string;
      if (role === "ADMIN" || role === "RECEPTION") {
        router.push("/admin");
      } else {
        router.push("/staff");
      }
    } catch {
      setError("Erro de conexao");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="border-4 border-[#161616] bg-[#FAF5EC] max-w-md w-full p-8 shadow-[6px_6px_0px_#161616]">
        <div className="text-center mb-6">
          <h1 className="font-title text-4xl tracking-wider">PINK DOG</h1>
          <p className="font-mono text-xs text-[#161616]/70">SYS_02 // LOGIN DE ACESSO</p>
        </div>
        {error && (
          <div className="mb-4 border-2 border-red-600 bg-red-50 p-2 text-xs font-mono text-red-700 font-bold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold mb-1">E-MAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border-2 border-[#161616] bg-white p-2.5 focus:outline-none focus:border-[#FF5882]" required />
          </div>
          <div>
            <label className="block font-bold mb-1">SENHA</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border-2 border-[#161616] bg-white p-2.5 focus:outline-none focus:border-[#FF5882]" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#FF5882] hover:bg-[#161616] text-white font-title text-xl py-2 border-2 border-[#161616] shadow-[3px_3px_0px_#161616] hover:shadow-none transition uppercase tracking-wider disabled:opacity-50">
            {loading ? "ENTRANDO..." : "ENTRAR \u2192"}
          </button>
        </form>
      </div>
    </main>
  );
}
