interface AuthLayoutProps {
    children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-blue"
            style={{
                backgroundImage: `
                    linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
                    radial-gradient(circle 500px at 0% 20%, rgba(139,92,246,0.3), transparent),
                    radial-gradient(circle 500px at 100% 0%, rgba(59,130,246,0.3), transparent)
                `,
                backgroundSize: "48px 48px, 48px 48px, 100% 100%, 100% 100%",
            }}
        >
            <div className="w-full max-w-sm md:max-w-4xl">
                {children}
            </div>
        </div>

    );
}

export default AuthLayout;