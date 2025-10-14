interface AuthLayoutProps {
    children: React.ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="flex flex-col gap-y-4">
            {children}
        </div>
    );

}

export default AuthLayout;