"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { getClientes, deleteClientes, createClientes, updateClientes } from "../api/auth";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    dni: "",
  });
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await getClientes();
        console.log('Clientes:', response); // Verifica que la respuesta sea la correcta
        setClientes(response.data); // Asumiendo que `response` es el arreglo de clientes
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleCheckboxChange = (id) => {
    setSelectedCliente(prevSelected => prevSelected === id ? null : id);
  };

  const handleDelete = async () => {
    if (!selectedCliente) {
      alert('Debes seleccionar un único cliente para eliminar.');
      return;
    }

    const clienteId = selectedCliente;
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al cliente con ID: ${clienteId}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteClientes(clienteId);
      setClientes((prevClientes) =>
        prevClientes.filter(cliente => cliente._id !== clienteId)
      );
      setSelectedCliente(null);
      alert('Cliente eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      alert('Hubo un error al intentar eliminar el cliente.');
    }
  };

  const handleAdd = () => {
    setOpenModal(true);
  };

  const handleEdit = () => {
    if (!selectedCliente) {
      alert('Debes seleccionar un único cliente para editar.');
      return;
    }

    const clienteToEdit = clientes.find((cliente) => cliente._id === selectedCliente);
    setNewCliente({
      id: clienteToEdit._id,
      nombre: clienteToEdit.nombre,
      correo: clienteToEdit.correo,
      telefono: clienteToEdit.telefono,
      dni: clienteToEdit.dni,
    });

    setOpenEditModal(true);
  };

  const handleCreateCliente = async () => {
    if (!newCliente.nombre || !newCliente.correo || !newCliente.telefono || !newCliente.dni) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await createClientes(newCliente);
      setClientes((prevClientes) => [...prevClientes, response.data]);
      setOpenModal(false);
      setNewCliente({ nombre: "", correo: "", telefono: "", dni: "" });
      alert('Nuevo cliente creado correctamente.');
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      alert('Hubo un error al intentar crear el cliente.');
    }
  };

  const handleUpdateCliente = async () => {
    if (!newCliente.nombre || !newCliente.correo || !newCliente.telefono || !newCliente.dni) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await updateClientes(newCliente);
      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente._id === newCliente.id
            ? { ...cliente, ...newCliente }
            : cliente
        )
      );
      setOpenEditModal(false);
      setNewCliente({ nombre: "", correo: "", telefono: "", dni: "" });
      alert('Cliente actualizado correctamente.');
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      alert('Hubo un error al intentar actualizar el cliente.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl m-4">Lista de Clientes</h1>
      <div className="container mx-auto p-4 flex-grow overflow-y-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Seleccionar</th>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Correo</th>
              <th className="border border-gray-300 p-2">Teléfono</th>
              <th className="border border-gray-300 p-2">DNI</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(clientes) && clientes.length > 0 ? (
              clientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCliente === cliente._id}
                      onChange={() => handleCheckboxChange(cliente._id)}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{cliente.nombre}</td>
                  <td className="border border-gray-300 p-2">{cliente.correo}</td>
                  <td className="border border-gray-300 p-2">{cliente.telefono}</td>
                  <td className="border border-gray-300 p-2">{cliente.dni}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-100 p-4 flex justify-around items-center h-1/4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleDelete}
        >
          Eliminar
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleAdd}
        >
          Agregar
        </button>
      </div>

      {/* Modal para agregar un cliente */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">Agregar un nuevo cliente</h3>
            <div>
              <Label htmlFor="nombre" value="Nombre" />
              <TextInput
                id="nombre"
                placeholder="Nombre del cliente"
                onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="correo" value="Correo" />
              <TextInput
                id="correo"
                placeholder="Correo del cliente"
                onChange={(e) => setNewCliente({ ...newCliente, correo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono" value="Teléfono" />
              <TextInput
                id="telefono"
                placeholder="Teléfono del cliente"
                onChange={(e) => setNewCliente({ ...newCliente, telefono: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dni" value="DNI" />
              <TextInput
                id="dni"
                placeholder="DNI del cliente"
                onChange={(e) => setNewCliente({ ...newCliente, dni: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contrasena" value="Contraseña" />
              <TextInput
                id="contrasena"
                placeholder="Contraseña del cliente"
                onChange={(e) => setNewCliente({ ...newCliente, contrasena: e.target.value })}
                required
              />
            </div>
            <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleCreateCliente}>
              Crear Cliente
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para editar un cliente */}
      <Modal show={openEditModal} size="md" onClose={() => setOpenEditModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900">Editar cliente</h3>
            <div>
              <Label htmlFor="nombre" value="Nombre" />
              <TextInput
                id="nombre"
                value={newCliente.nombre}
                onChange={(e) => setNewCliente({ ...newCliente, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="correo" value="Correo" />
              <TextInput
                id="correo"
                value={newCliente.correo}
                onChange={(e) => setNewCliente({ ...newCliente, correo: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="telefono" value="Teléfono" />
              <TextInput
                id="telefono"
                value={newCliente.telefono}
                onChange={(e) => setNewCliente({ ...newCliente, telefono: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dni" value="DNI" />
              <TextInput
                id="dni"
                value={newCliente.dni}
                onChange={(e) => setNewCliente({ ...newCliente, dni: e.target.value })}
                required
              />
            </div>
            <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleUpdateCliente}>
              Actualizar Cliente
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Clientes;