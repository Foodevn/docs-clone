"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            console.log("Đăng nhập thành công");
            router.push("/");
        } else {
            const data = await res.json();
            setError(data.error || "Đăng nhập thất bại");
        }
        setLoading(false);
    };
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Đăng nhập
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="nhập email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>
                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-700 transition duration-200"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <a
                        href="/sign-up"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Đăng ký ngay
                    </a>
                </div>
            </div>
        </div>
    )
}
export default SignInPage;

// function LoginPage() {
//     const router = useRouter();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     async function handleLogin(e: React.FormEvent) {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         const res = await fetch("/api/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         });

//         setLoading(false);
//         if (res.ok) {
//             console.log("Đăng nhập thành công");
//             router.push("/");
//         } else {
//             const data = await res.json();
//             setError(data.error || "Đăng nhập thất bại");
//         }
//     }

//     return (
//         <div className="flex min-h-screen items-center justify-center bg-gray-100">
//             <form
//                 onSubmit={handleLogin}
//                 className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-4"
//             >
//                 <h1 className="text-2xl font-bold text-center text-blue-600">Đăng nhập</h1>

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     className="w-full border rounded-lg p-2"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />

//                 <input
//                     type="password"
//                     placeholder="Mật khẩu"
//                     className="w-full border rounded-lg p-2"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                 />

//                 {error && <p className="text-red-600 text-sm">{error}</p>}

//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
//                 >
//                     {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//                 </button>

//                 <p className="text-sm text-center">
//                     Chưa có tài khoản?{" "}
//                     <a href="/sign-up" className="text-blue-600 font-semibold hover:underline">
//                         Đăng ký
//                     </a>
//                 </p>
//             </form>
//         </div>
//     );
// }



