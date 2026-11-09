"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"client" | "staff">("client");
  const [identifier, setIdentifier] = useState("");
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
        body: JSON.stringify({ email: identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciais invalidas");
        setLoading(false);
        return;
      }
      const role = data.role as string;
      if (role === "CLIENT") {
        router.push("/cliente");
      } else if (role === "ADMIN" || role === "RECEPTION") {
        router.push("/admin");
      } else {
        router.push("/staff");
      }
    } catch {
      setError("Erro de conexao");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-paper">
      <div className="border-[3px] border-ink bg-white max-w-md w-full p-8 shadow-brutal-lg">
        <div className="text-center mb-6">
          <h1 className="font-title text-4xl tracking-wider">PINK DOG</h1>
          <p className="font-mono text-xs text-ink/70">SYS_02 // LOGIN DE ACESSO</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setMode("client")}
            className={`py-2 text-xs font-mono font-bold border-2 border-ink transition ${
              mode === "client" ? "bg-pink-pop text-black" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            SOU CLIENTE
          </button>
          <button
            type="button"
            onClick={() => setMode("staff")}
            className={`py-2 text-xs font-mono font-bold border-2 border-ink transition ${
              mode === "staff" ? "bg-ink text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            SOU FUNCIONARIO
          </button>
        </div>

        {error && (
          <div className="mb-4 border-2 border-red-600 bg-red-50 p-2 text-xs font-mono text-red-700 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold mb-1">
              {mode === "client" ? "E-MAIL OU TELEFONE" : "E-MAIL"}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border-2 border-ink bg-white p-2.5 focus:outline-none focus:border-pink-pop"
              required
              placeholder={mode === "client" ? "tutor@email.com ou 11988413320" : "funcionario@pinkdog.vet"}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">SENHA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-ink bg-white p-2.5 focus:outline-none focus:border-pink-pop"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-pop hover:bg-ink text-black hover:text-white font-title text-xl py-2 border-2 border-ink shadow-brutal hover:shadow-none transition uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "ENTRANDO..." : "ENTRAR \u2192"}
          </button>
        </form>

        {mode === "client" && (
          <div className="mt-4 text-center">
            <a href="/cadastro" className="text-xs font-mono font-bold text-pink-pop hover:underline">
              Nao tem cadastro? Cadastre-se aqui →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
