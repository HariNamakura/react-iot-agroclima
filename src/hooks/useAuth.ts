import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constants/urls";
import { message } from "antd";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer , setAnswer] = useState<string | null>(null);
  const navigate = useNavigate();
  //Funcion recuperar contrasena

  const forgotPass = async (values: { documento: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BACKEND_URL + "/api/recoveryPass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documento: values.documento }) 
      });
      if (!response.ok) throw new Error("Usuario no existe");

      const data = await response.json();
      message.success(data.message + " " +data.email);  
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (documento: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(BACKEND_URL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documento, password }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      await response.json();

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      const response = await fetch(BACKEND_URL + "/api/logout", {
        method: "POST",
        credentials: "include", // Incluye las cookies en la solicitud
      });

      if (response.ok) {
        // Limpia cualquier estado de usuario en el localStorage si lo hubiera
        localStorage.removeItem("userAuth"); // Si almacenas algo relacionado con la autenticación

        // Usa navigate en lugar de window.location para evitar recargas completas
        navigate("/login", { replace: true });
      } else {
        console.error("Error al cerrar sesión:", response.statusText);
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return { login, logout, forgotPass, loading, error, answer };
};
