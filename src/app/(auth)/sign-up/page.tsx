"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        setLoading(false);
        const data = await res.json();

        if (res.ok) {
            setSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
            setTimeout(() => router.push("/sign-in"), 1000);
        } else {
            setError(data.error || "Đăng ký thất bại");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-4"
            >
                <h1 className="text-2xl font-bold text-center text-green-600">Đăng ký</h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-lg p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full border rounded-lg p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg"
                >
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>

                <p className="text-sm text-center">
                    Đã có tài khoản?{" "}
                    <a href="/sign-in" className="text-blue-600 font-semibold hover:underline">
                        Đăng nhập
                    </a>
                </p>
            </form>
        </div>
    );
}


// const SignUpPage = () => {
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");

//     const handleRegister = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (password !== confirmPassword) {
//             alert("Mật khẩu xác nhận không khớp!");
//             return;
//         }

//         console.log({ name, email, password });
//     };
//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
//             <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
//                 <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
//                     Đăng ký tài khoản
//                 </h2>

//                 <form onSubmit={handleRegister} className="space-y-5">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Họ và tên
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Nguyễn Văn A"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             placeholder="nhập email của bạn"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Mật khẩu
//                         </label>
//                         <input
//                             type="password"
//                             placeholder="••••••••"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Xác nhận mật khẩu
//                         </label>
//                         <input
//                             type="password"
//                             placeholder="nhập lại mật khẩu"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition duration-200"
//                     >
//                         Đăng ký
//                     </button>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-gray-500">
//                     Đã có tài khoản?{" "}
//                     <a
//                         href="/login"
//                         className="text-blue-600 font-medium hover:underline"
//                     >
//                         Đăng nhập
//                     </a>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default SignUpPage;