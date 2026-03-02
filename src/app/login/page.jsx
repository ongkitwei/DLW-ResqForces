"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // skip login if already logged in
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/emergency-page");
    })();
  }, [router]);

  async function handleSignup() {
    setMsg("");
    if (!email || !password) return setMsg("Email and password required.");

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) return setMsg("Signup failed: " + error.message);
    setMsg("Signed up! Now log in.");
  }

  async function handleLogin() {
    setMsg("");
    if (!email || !password) return setMsg("Email and password required.");

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) return setMsg("Login failed: " + error.message);

    router.push("/emergency-page");
  }

  async function handleGoogle() {
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/emergency-page",
      },
    });

    setLoading(false);
    if (error) setMsg("Google login failed: " + error.message);
  }

  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <h1>Login</h1>

        <button className={`${styles.btn} ${styles.google}`} onClick={handleGoogle} disabled={loading}>
          <img className={styles.gLogo} src="/google.svg" alt="" aria-hidden="true" />
          Continue with Google
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div className={styles.row}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={handleSignup} disabled={loading}>
            {loading ? "Working..." : "Sign up"}
          </button>

          <button className={styles.btn} onClick={handleLogin} disabled={loading}>
            {loading ? "Working..." : "Log in"}
          </button>
        </div>

        <p className={styles.msg}>{msg}</p>
      </div>
    </main>
  );
}