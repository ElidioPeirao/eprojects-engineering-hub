
import AuthForm from "@/components/AuthForm";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-black to-[#1a1209]">
      <div className="w-full max-w-md">
        <AuthForm isLogin={false} />
      </div>
    </div>
  );
};

export default Register;
