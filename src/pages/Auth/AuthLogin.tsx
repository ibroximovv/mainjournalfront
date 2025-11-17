// src/pages/Auth/AuthLogin.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const apiBaseRaw = import.meta.env.VITE_API_URL || "";
const apiBase = apiBaseRaw.replace(/\/$/, ""); // trailing slashdan xalos bo'lamiz

const join = (path: string) => `${apiBase}${path.startsWith("/") ? "" : "/"}${path}`;

type LoginResp = { token: string } | { message?: string };

const AuthLogin = () => {

  // login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // forgot password fields / steps
  // const [fpStep, setFpStep] = useState<"idle" | "send" | "verify" | "reset">("idle");
  // const [fpEmail, setFpEmail] = useState("");
  // const [fpPhone, setFpPhone] = useState("");
  // const [fpOtp, setFpOtp] = useState("");
  // const [newPassword, setNewPassword] = useState("");

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // yordamchi: oddiy validatsiya
  const notEmpty = (s: string) => s.trim().length > 0;

  // 1) login
  const handleLogin = async () => {
    setError(null);
    setInfo(null);
    if (!notEmpty(username) || !notEmpty(password)) {
      setError("Iltimos username va passwordni kiriting.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(join("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResp = await res.json();
      if (!res.ok) throw new Error((data as any)?.message || "Login xatolik");

      const token = (data as any).token;
      if (!token) throw new Error("Token topilmadi");

      // saqlash
      localStorage.setItem("token", token);

      // userni olish
      const userRes = await fetch(join("/user/me"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = await userRes.json();
      if (!userRes.ok) throw new Error(userData?.message || "User olinmadi");

      // role ga qarab yo'naltirish
      const role = (userData as any)?.role?.toString?.().toUpperCase?.() || "USER";
      switch (role) {
        case "ADMIN":
          const path = "/dashboard/admin";
          if (window.location.pathname !== path) {
            window.location.href = path;
            return;
          }
          break;
        case "SUPERADMIN":
          window.location.href = "/dashboard/superadmin";
          return;
        default:
          window.location.href = "/dashboard/user";
          return;
      }
    } catch (err: any) {
      setError(err?.message || "Login jarayonida xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Forgot password oqimi ----------
  // // send otp
  // const handleFpSendOtp = async () => {
  //   setError(null);
  //   setInfo(null);
  //   if (!fpEmail && !fpPhone) {
  //     setError("Iltimos email yoki telefon kiriting.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const payload: any = {};
  //     if (fpEmail) payload.email = fpEmail;
  //     if (fpPhone) payload.phoneNumber = fpPhone;

  //     const res = await fetch(join("/auth/send-otp"), {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message || "OTP yuborilmadi");
  //     setInfo("OTP yuborildi. Iltimos kodni kiriting.");
  //     setFpStep("verify");
  //   } catch (err: any) {
  //     setError(err?.message || "OTP yuborishda xatolik");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // verify otp
  // const handleFpVerifyOtp = async () => {
  //   setError(null);
  //   setInfo(null);
  //   if (!fpOtp) {
  //     setError("Iltimos OTP kodni kiriting.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const payload: any = { otp: fpOtp };
  //     if (fpEmail) payload.email = fpEmail;
  //     if (fpPhone) payload.phoneNumber = fpPhone;

  //     const res = await fetch(join("/auth/verify-otp"), {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message || "OTP tekshirilmedi");

  //     setInfo("OTP tasdiqlandi. Endi yangi parol qo'ying.");
  //     setFpStep("reset");
  //   } catch (err: any) {
  //     setError(err?.message || "OTP tekshirishda xatolik");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // reset password
  // const handleFpReset = async () => {
  //   setError(null);
  //   setInfo(null);
  //   if (!newPassword || newPassword.length < 6) {
  //     setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const payload: any = { password: newPassword };
  //     if (fpEmail) payload.email = fpEmail;
  //     if (fpPhone) payload.phoneNumber = fpPhone;

  //     const res = await fetch(join("/auth/forgot-password"), {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data?.message || "Parol yangilanmadi");

  //     setInfo("Parol muvaffaqiyatli yangilandi. Iltimos tizimga kiring.");
  //     setFpStep("idle");
  //   } catch (err: any) {
  //     setError(err?.message || "Parolni yangilashda xatolik");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // small UI helper: simple spinner
  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 inline-block" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 sm:p-8"
      >
        <h2 className="text-2xl font-semibold mb-2 text-slate-800">Tizimga kirish</h2>
        <p className="text-sm text-slate-500 mb-4">Username va password bilan kiring yoki parolni tiklang.</p>

        {error && <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
        {info && <div className="mb-3 text-sm text-green-700 bg-green-50 p-3 rounded">{info}</div>}

        {/* Login form */}
        <div className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          <div className="flex items-center justify-between gap-3">
            <Button onClick={handleLogin} disabled={loading} className="flex-1">
              {loading ? <><Spinner /> &nbsp; Kirilmoqda...</> : "Kirish"}
            </Button>

            {/* <button
              onClick={() => {
                // open forgot flow
                // setFpStep("send");
                setError(null);
                setInfo(null);
              }}
              className="text-sm underline text-slate-600"
            >
              Parolni unutdingizmi?
            </button> */}
          </div>
        </div>

        {/* Forgot password panel */}
        {/* {fpStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.25 }}
            className="mt-6 border-t pt-4"
          > */}
            {/* send */}
            {/* {fpStep === "send" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Email yoki telefon kiriting — OTP yuboramiz.</p>
                <input
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  placeholder="email@example.com (optional)"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <input
                  value={fpPhone}
                  onChange={(e) => setFpPhone(e.target.value)}
                  placeholder="+998..."
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleFpSendOtp} disabled={loading} className="flex-1">
                    {loading ? <><Spinner /> &nbsp; Yuborilmoqda...</> : "OTP yuborish"}
                  </Button>
                  <button
                    onClick={() => setFpStep("idle")}
                    className="text-sm underline text-slate-600"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )} */}

            {/* verify */}
            {/* {fpStep === "verify" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Yuborilgan kodni kiriting</p>
                <input
                  value={fpOtp}
                  onChange={(e) => setFpOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full rounded-md border px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleFpVerifyOtp} disabled={loading} className="flex-1">
                    {loading ? <><Spinner /> &nbsp; Tekshirilmoqda...</> : "Kodni tasdiqlash"}
                  </Button>
                  <button
                    onClick={() => {
                      setFpStep("send");
                      setFpOtp("");
                    }}
                    className="text-sm underline text-slate-600"
                  >
                    Qayta yuborish
                  </button>
                </div>
              </div>
            )} */}

            {/* reset */}
            {/* {fpStep === "reset" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Yangi parol kiriting</p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yangi parol (kamida 6 belgi)"
                  className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <div className="flex items-center gap-3">
                  <Button onClick={handleFpReset} disabled={loading} className="flex-1">
                    {loading ? <><Spinner /> &nbsp; Yangilanmoqda...</> : "Parolni yangilash"}
                  </Button>
                  <button
                    onClick={() => setFpStep("idle")}
                    className="text-sm underline text-slate-600"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )} */}
          {/* </motion.div>
        )} */}
      </motion.div>
    </div>
  );
};

export default AuthLogin;
