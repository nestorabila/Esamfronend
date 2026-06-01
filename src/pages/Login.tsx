import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-12 shadow-2xl">
        <button
          onClick={() => navigate("/app/home")}
          className="
            px-16 py-5
            text-2xl font-bold text-white
            rounded-2xl
            bg-gradient-to-r from-cyan-400 to-blue-600
            hover:scale-105
            transition-all duration-300
          "
        >
          ACCEDER
        </button>
      </div>
    </div>
  );
}

export default Login;