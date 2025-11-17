// src/pages/Auth/AuthRegister.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type SendOtpPayload = {
  email?: string;
  phoneNumber?: string;
};

type VerifyOtpPayload = {
  email?: string;
  phoneNumber?: string;
  otp: string;
};

type RegisterPayload = {
  username: string;
  password: string;
  email?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  courseNumber?: number;
  groupName?: string;
  telegramUsername?: string;
};

const apiBase = import.meta.env.VITE_API_URL || "";

const AuthRegister = () => {
  const navigate = useNavigate();

  // step: "send", "verify", "register", "done"
  const [step, setStep] = useState<"send" | "verify" | "register" | "done">(
    "send"
  );

  // common fields
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // register form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [courseNumber, setCourseNumber] = useState<number | "">("");
  const [groupName, setGroupName] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  // status / errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helpers: basic validation
  const validEmail = (v: string) =>
    v.length > 3 && v.includes("@") && v.includes(".");
  const validPhone = (v: string) => /^\+?\d{9,15}$/.test(v); // simple

  // 1) send OTP
  const handleSendOtp = async () => {
    setError(null);
    if (!email && !phoneNumber) {
      setError("Iltimos email yoki telefon raqamini kiriting.");
      return;
    }
    if (email && !validEmail(email)) {
      setError("Iltimos to'g'ri email kiriting.");
      return;
    }
    if (phoneNumber && !validPhone(phoneNumber)) {
      setError("Iltimos xalqaro formatdagi telefon kiriting (masalan +998...)");
      return;
    }

    setLoading(true);
    try {
      const payload: SendOtpPayload = {};
      if (email) payload.email = email;
      if (phoneNumber) payload.phoneNumber = phoneNumber;

      const res = await fetch(`${apiBase}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "OTP yuborilmadi");

      setOtpSent(true);
      setStep("verify");
      setSuccess("OTP yuborildi. Iltimos kodni kiriting.");
    } catch (err: any) {
      setError(err?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // 2) verify OTP
  const handleVerifyOtp = async () => {
    setError(null);
    if (otp.trim().length < 3) {
      setError("Iltimos OTP kodni kiriting.");
      return;
    }

    setLoading(true);
    try {
      const payload: VerifyOtpPayload = { otp };
      if (email) payload.email = email;
      if (phoneNumber) payload.phoneNumber = phoneNumber;

      const res = await fetch(`${apiBase}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "OTP tekshirilmdi");

      // agar muvaffaqiyat bo'lsa, keyingi formga o'tamiz
      setStep("register");
      setSuccess("OTP tasdiqlandi. Endi ro'yxatdan o'tish formasi.");
    } catch (err: any) {
      setError(err?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // 3) register
  const handleRegister = async () => {
    setError(null);
    if (!username || !password || !firstName || !lastName) {
      setError("Iltimos barcha majburiy maydonlarni to'ldiring (username, password, firstName, lastName).");
      return;
    }
    if (email && !validEmail(email)) {
      setError("Iltimos to'g'ri email kiriting.");
      return;
    }
    if (phoneNumber && !validPhone(phoneNumber)) {
      setError("Telefon formatini tekshiring.");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        username,
        password,
        email: email || undefined,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        courseNumber: typeof courseNumber === "number" ? courseNumber : undefined,
        groupName: groupName || undefined,
        telegramUsername: telegramUsername || undefined,
      };

      const res = await fetch(`${apiBase}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Ro'yxatdan o'tishda xato");

      setSuccess("Ro'yxatdan muvaffaqiyatli o'tdingiz. Iltimos tizimga kiring.");
      setStep("done");
      // avtomatik yo'naltirish: login sahifasiga
      setTimeout(() => navigate("/auth/login"), 1200);
    } catch (err: any) {
      setError(err?.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // UI helpers: OTP inputs (simple single input here)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6 sm:p-10"
      >
        <h2 className="text-2xl font-semibold mb-2 text-slate-800">
          Ro'yxatdan o'tish
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Iltimos email yoki telefon orqali OTP oling va ro'yxatdan o'tishni yakunlang.
        </p>

        {/* status messages */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        {/* STEP: send OTP */}
        {step === "send" && (
          <div className="space-y-3">
            <label className="block text-sm">
              Email (optional)
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>

            <label className="block text-sm">
              Telefon (optional)
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+998..."
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Yuborilmoqda..." : "OTP yuborish"}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Eslatma: email yoki telefon kiritishingiz yetarli. Agar ikkalasini ham kiritsangiz, backend qaysi biriga yuborishni hal qiladi.
            </p>
          </div>
        )}

        {/* STEP: verify OTP */}
        {step === "verify" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Sizga yuborilgan kodni kiriting</p>
            <input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="1234"
              className="w-full text-center text-lg rounded-md border px-3 py-2 tracking-widest focus:outline-none focus:ring-2 focus:ring-sky-400"
              maxLength={8}
            />

            <div className="flex items-center gap-3">
              <Button onClick={handleVerifyOtp} disabled={loading} className="flex-1">
                {loading ? "Tekshirilmoqda..." : "Kodni tasdiqlash"}
              </Button>
              <button
                className="text-sm underline text-slate-600"
                onClick={() => {
                  // qayta yuborish: qaytadan send
                  setStep("send");
                  setOtp("");
                  setOtpSent(false);
                }}
              >
                Qayta yuborish
              </button>
            </div>
          </div>
        )}

        {/* STEP: register */}
        {step === "register" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username *"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password *"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name *"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name *"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone (optional)"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional)"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="number"
                value={courseNumber as any}
                onChange={(e) => setCourseNumber(e.target.value ? Number(e.target.value) : "")}
                placeholder="Course number (optional)"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name (optional)"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <input
              type="text"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="@telegram (optional)"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />

            <div className="flex items-center gap-3">
              <Button onClick={handleRegister} disabled={loading} className="flex-1">
                {loading ? "Ro'yxat qilinmoqda..." : "Ro'yxatdan o'tish"}
              </Button>
              <button
                className="text-sm underline text-slate-600"
                onClick={() => {
                  setStep("send");
                }}
              >
                Orqaga
              </button>
            </div>
          </div>
        )}

        {/* STEP: done */}
        {step === "done" && (
          <div className="text-center py-6">
            <h3 className="font-medium">Tabriklaymiz!</h3>
            <p className="text-sm text-slate-600">Endi tizimga kirishingiz mumkin.</p>
            <div className="mt-4">
              <Button onClick={() => navigate("/auth/login")}>Tizimga kirish</Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthRegister;
