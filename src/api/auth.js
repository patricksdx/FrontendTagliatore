import axios from "axios";

const API = 'http://localhost:3000'

export const registerRequest = user => axios.post(`${API}/auth/register`, user)
export const loginRequest = async (loginData) => {
    return await axios.post(`${API}/auth/login`, loginData, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const getMeseros = () => axios.get(`${API}/api/meseros`);
export const deleteMeseros = (id) => axios.delete(`${API}/api/meseros/${id}`);
export const createMeseros = (newMesero) => axios.post(`${API}/api/meseros`, newMesero, {
    headers: {
        'Content-Type': 'application/json',
    }
});
export const updateMeseros = (newMesero) => {
    return axios.put(`${API}/api/meseros/${newMesero.id}`, newMesero, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const getClientes = () => axios.get(`${API}/api/clientes`);
export const deleteClientes = (id) => axios.delete(`${API}/api/clientes/${id}`);
export const createClientes = (newCliente) => axios.post(`${API}/api/clientes`, newCliente, {
    headers: {
        'Content-Type': 'application/json',
    }
});
export const updateClientes = (newCliente) => {
    return axios.put(`${API}/api/clientes/${newCliente.id}`, newCliente, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};

export const getOrdenPorMesa = (id) => axios.get(`${API}/api/ordenes/${id}`);
export const deleteOrden = async (id) => {
    try {
        const response = await axios.delete(`${API}/api/ordenes/${id}`);
        return response.data; // Confirma que la respuesta sea manejada correctamente
    } catch (error) {
        console.error("Error en deleteOrden:", error);
        throw error;
    }
};

export const createOrden = (newOrden) => axios.post(`${API}/api/ordenes`, newOrden, {
    headers: {
        'Content-Type': 'application/json',
    }
});
export const updateEstadoOrden = (newOrden) => {
    return axios.put(`${API}/api/ordenes/${newOrden.id}`, newOrden, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
};
