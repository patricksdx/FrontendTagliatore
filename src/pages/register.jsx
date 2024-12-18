import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function Register() {
    const navigate = useNavigate();  
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch("contrasena");

    const goToLogin = () => {
        navigate('/login');
    };

    const { signup, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated])
    
    const onSubmit = async (data) => {
        const { confirmContrasena, ...valuesToSend } = data;
        console.log("No se usa: " + confirmContrasena);
        console.log(valuesToSend);
        await signup(valuesToSend);
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-black mb-6">Registrar</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            {...register('nombre', { required: true })}
                            placeholder="Nombre"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            {...register('correo', { required: true })}
                            placeholder="Correo"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            {...register('telefono', { required: true })}
                            placeholder="Telefono"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            {...register('dni', { required: true })}
                            placeholder="DNI"
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register('contrasena', { required: true })}
                            placeholder="Contraseña"
                            className={`w-full p-3 border ${errors.contrasena || errors.passwordMismatch ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            {...register('confirmContrasena', {
                                required: true,
                                validate: value => value === password || "Las contraseñas no coinciden"
                            })}
                            placeholder="Confirmar Contraseña"
                            className={`w-full p-3 border ${errors.confirmContrasena ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-black`}
                        />
                        {errors.confirmContrasena && <span className="text-red-500 text-sm">{errors.confirmContrasena.message}</span>}
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full p-3 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none"

                            //Guardado de token y redireccion al "/" para ver el dasboard
                        >
                            Registrar
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={goToLogin}
                            className="w-full p-3 bg-white text-black rounded-md shadow-xl hover:bg-gray-200 focus:outline-none"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;