
import AuthForm from "@/components/AuthForm";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-[#1a1209]">
      <div className="w-full max-w-md">
        <AuthForm isLogin={true} />
      </div>
    </div>
  );
};

export default Login;
