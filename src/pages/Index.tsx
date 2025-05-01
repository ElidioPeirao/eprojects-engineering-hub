
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  // Redirecionar para a página Home
  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

export default Index;
