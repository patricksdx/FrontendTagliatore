"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import { getOrdenPorMesa, createOrden, updateEstadoOrden } from "../api/auth";

function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newOrden, setNewOrden] = useState({
    idMesa: "",
    estado: "pendiente",
    platillos: [],
    platilloNombre: "",  // Inicializado como cadena vacía
    platilloCantidad: "",  // Inicializado como cadena vacía
  });
  const [searchIdMesa, setSearchIdMesa] = useState("");

  const fetchOrdenes = async (idMesa) => {
    try {
      const response = await getOrdenPorMesa(idMesa);
      if (Array.isArray(response.data)) {
        setOrdenes(response.data);
      } else {
        console.error("La respuesta no es un arreglo válido:", response.data);
        setOrdenes([]);
      }
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      setOrdenes([]);  // Asegúrate de que `ordenes` sea siempre un arreglo
    }
  };

  const handleSearchChange = (e) => setSearchIdMesa(e.target.value);

  const handleSearch = () => {
    fetchOrdenes(searchIdMesa);
  };

  const handleAdd = () => {
    setOpenModal(true);
  };

  const handleEdit = (orden) => {
    setNewOrden({
      id: orden._id,
      idMesa: orden.idMesa,
      estado: orden.estado,
      platillos: orden.platillos,
    });
    setOpenEditModal(true);
  };

  const handleCreateOrden = async () => {
    if (!newOrden.idMesa || newOrden.platillos.length === 0) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const platillosValidos = newOrden.platillos.filter((platillo) => {
      const { nombre, cantidad } = platillo;
      return nombre && cantidad > 0 && !isNaN(cantidad);
    });

    if (platillosValidos.length === 0) {
      alert("Por favor, asegúrese de que todos los platillos tengan formato correcto. Ejemplo: 'pizza' y cantidad '2'.");
      return;
    }

    const payload = { ...newOrden, platillos: platillosValidos };

    try {
      const response = await createOrden(payload);
      setOrdenes((prevOrdenes) => [...prevOrdenes, response.data]);
      setOpenModal(false);
      setNewOrden({ idMesa: "", estado: "pendiente", platillos: [] });
      alert("Nueva orden creada correctamente.");

      // Recargar las órdenes para actualizar la lista
      fetchOrdenes(newOrden.idMesa);
    } catch (error) {
      console.error("Error al crear la orden:", error);
      alert("Hubo un error al intentar crear la orden.");
    }
  };

  const handleUpdateEstadoOrden = async () => {
    try {
      const payload = { estado: newOrden.estado };
      await updateEstadoOrden({ id: newOrden.id, ...payload });
      
      // Actualizar el estado de la orden en el estado local
      setOrdenes((prevOrdenes) =>
        prevOrdenes.map((orden) =>
          orden._id === newOrden.id ? { ...orden, estado: newOrden.estado } : orden
        )
      );
  
      // Cerrar el modal de edición
      setOpenEditModal(false);
      setNewOrden({ idMesa: "", estado: "pendiente", platillos: [] });
  
      alert("Estado de la orden actualizado correctamente.");
  
      // Recargar las órdenes después de la actualización del estado
      fetchOrdenes(newOrden.idMesa);
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error);
      alert("Hubo un error al intentar actualizar el estado de la orden.");
    }
  };  

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl m-4">Lista de Órdenes</h1>

      <div className="mb-4 p-4 flex items-center space-x-2">
        <TextInput
          id="search"
          placeholder="Buscar por ID de mesa"
          value={searchIdMesa}
          onChange={handleSearchChange}
        />
        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSearch}>Buscar</Button>
        <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleAdd}>Agregar</Button>
      </div>

      <div className="container mx-auto p-4 flex-grow overflow-y-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">ID Mesa</th>
              <th className="border border-gray-300 p-2">Platillos</th>
              <th className="border border-gray-300 p-2">Estado</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(ordenes) && ordenes.length > 0 ? (
              ordenes.map((orden) => (
                <tr key={orden._id}>
                  <td className="border border-gray-300 p-2">{orden.idMesa}</td>
                  <td className="border border-gray-300 p-2">
                    {Array.isArray(orden.platillos) && orden.platillos.length > 0 ? (
                      orden.platillos.map((platillo, index) => (
                        <div key={index}>{platillo.nombre} ({platillo.cantidad})</div>
                      ))
                    ) : (
                      <div>No hay platillos</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{orden.estado}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleEdit(orden)}>Modificar</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron órdenes
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <Label htmlFor="idMesa" value="ID Mesa" />
              <TextInput
                id="idMesa"
                value={newOrden.idMesa}
                onChange={(e) => setNewOrden({ ...newOrden, idMesa: e.target.value })}
                required
              />

              <div className="my-4">
                <Label htmlFor="nombrePlatillo" value="Nombre del Platillo" />
                <TextInput
                  id="nombrePlatillo"
                  value={newOrden.nombrePlatillo}
                  onChange={(e) => setNewOrden({ ...newOrden, nombrePlatillo: e.target.value })}
                  required
                />
              </div>

              <div className="my-4">
                <Label htmlFor="cantidadPlatillo" value="Cantidad del Platillo" />
                <TextInput
                  id="cantidadPlatillo"
                  type="number"
                  value={newOrden.cantidadPlatillo}
                  onChange={(e) => setNewOrden({ ...newOrden, cantidadPlatillo: e.target.value })}
                  required
                />
              </div>

              <Button
                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => {
                  if (newOrden.nombrePlatillo && newOrden.cantidadPlatillo > 0) {
                    setNewOrden({
                      ...newOrden,
                      platillos: [
                        ...newOrden.platillos,
                        { nombre: newOrden.nombrePlatillo, cantidad: parseInt(newOrden.cantidadPlatillo) },
                      ],
                      nombrePlatillo: "",
                      cantidadPlatillo: "",
                    });
                  } else {
                    alert("Por favor ingrese un nombre y una cantidad válida para el platillo.");
                  }
                }}
              >
                Agregar Platillo
              </Button>

              <Button
                className="mt-10 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleCreateOrden}
              >
                Crear orden
              </Button>
            </div>

            <div className="w-1/2 pl-4">
              <h3 className="text-lg font-semibold mb-2">Platillos a agregar</h3>
              <ul className="list-disc pl-4">
                {newOrden.platillos.length > 0 ? (
                  newOrden.platillos.map((platillo, index) => (
                    <li key={index}>
                      {platillo.nombre} ({platillo.cantidad})
                    </li>
                  ))
                ) : (
                  <li>No hay platillos agregados</li>
                )}
              </ul>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div>
            <Label className="me-10" htmlFor="estado" value="Estado" />
            <select
              id="estado"
              value={newOrden.estado}
              onChange={(e) => setNewOrden({ ...newOrden, estado: e.target.value })}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
            <Button className="mt-10 bg-blue-500 text-white hover:bg-blue-600" onClick={handleUpdateEstadoOrden}>Actualizar estado</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Ordenes;
