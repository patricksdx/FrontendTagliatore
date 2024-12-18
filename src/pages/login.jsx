import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useEffect } from 'react';


function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const goToRegister = () => {
        navigate('/register');
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated])

    const onSubmit = async (values) => {
        const loginData = {
            correo: values.correo,
            contrasena: values.contrasena,
        };
        console.log(loginData);
        try {
            const res = await login(loginData);
            console.log("Respuesta del servidor:", res.data);
        } catch (error) {
            console.error("Error durante el login:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-black mb-6">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            {...register('correo', { required: "El correo es obligatorio" })}
                            placeholder="Correo"
                            className={`w-full p-3 border ${errors.correo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                        />
                        {errors.correo && <span className="text-red-500 text-sm">{errors.correo.message}</span>}
                    </div>

                    <div>
                        <input
                            type="password"
                            {...register('contrasena', { required: "La contraseña es obligatoria" })}
                            placeholder="Contraseña"
                            className={`w-full p-3 border ${errors.contrasena ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                        />
                        {errors.contrasena && <span className="text-red-500 text-sm">{errors.contrasena.message}</span>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none"
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={goToRegister} // Cambié la llamada a la función
                            className="w-full p-3 bg-white text-black rounded-md shadow-xl hover:bg-gray-200 focus:outline-none"
                        >
                            Registrate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;