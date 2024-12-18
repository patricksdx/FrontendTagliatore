"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { getMeseros, deleteMeseros, createMeseros, updateMeseros } from '../api/auth'; // Asegúrate de que esta sea la ruta correcta para tu archivo de funciones API

function Meseros() {
  const [meseros, setMeseros] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newMesero, setNewMesero] = useState({ nombre: "", email: "", activo: true });
  const [selectedMesero, setSelectedMesero] = useState(null);

  useEffect(() => {
    const fetchMeseros = async () => {
      try {
        const response = await getMeseros();
        console.log('Datos de meseros:', response.data);
        setMeseros(response.data.meseros);
      } catch (error) {
        console.error('Error al obtener los meseros:', error);
      }
    };

    fetchMeseros();
  }, []);

  const handleCheckboxChange = (id) => {
    // Si el mesero está ya seleccionado, lo deselecciona, si no lo selecciona
    setSelectedMesero(prevSelected => prevSelected === id ? null : id);
  };


  const handleDelete = async () => {
    if (!selectedMesero) {
      alert('Debes seleccionar un único mesero para eliminar.');
      return;
    }
  
    const meseroId = selectedMesero;
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar al mesero con ID: ${meseroId}?`
    );
  
    if (!confirmDelete) {
      return;
    }
  
    try {
      await deleteMeseros(meseroId);
      setMeseros((prevMeseros) =>
        prevMeseros.map((mesero) =>
          mesero._id === meseroId ? { ...mesero, activo: false } : mesero
        )
      );
      setSelectedMesero(null); // Resetea la selección
      alert('El estado del mesero se ha actualizado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el mesero:', error);
      alert('Hubo un error al intentar actualizar el estado del mesero.');
    }
  };

  const handleAdd = () => {
    setOpenModal(true);
  };

  const handleEdit = () => {
    if (!selectedMesero) {
      alert('Debes seleccionar un único mesero para editar.');
      return;
    }
  
    const meseroToEdit = meseros.find((mesero) => mesero._id === selectedMesero);
    setNewMesero({
      id: meseroToEdit._id,
      nombre: meseroToEdit.nombre,
      email: meseroToEdit.email,
      activo: meseroToEdit.activo
    });
  
    setOpenEditModal(true);
  };

  const handleCreateMesero = async () => {
    if (!newMesero.nombre || !newMesero.email) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      await createMeseros(newMesero);
      setMeseros((prevMeseros) => [...prevMeseros, newMesero]);
      setOpenModal(false); // Cierra el modal
      setNewMesero({ nombre: "", email: "", activo: true }); // Resetea los campos
      alert('Nuevo mesero creado correctamente.');
    } catch (error) {
      console.error('Error al crear el mesero:', error);
      alert('Hubo un error al intentar crear el mesero.');
    }
  };

  const handleUpdateMesero = async () => {
    console.log("Actualizando mesero con ID:", newMesero.id);
    console.log("Datos a enviar:", newMesero);

    if (!newMesero.nombre || !newMesero.email) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await updateMeseros(newMesero);
      console.log("Respuesta de la API:", response);  // Verifica la respuesta de la API

      setMeseros((prevMeseros) =>
        prevMeseros.map((mesero) =>
          mesero._id === newMesero.id ? { ...mesero, nombre: newMesero.nombre, email: newMesero.email } : mesero
        )
      );

      setOpenEditModal(false);
      setNewMesero({ nombre: "", email: "", activo: true });
      alert('Mesero actualizado correctamente.');
    } catch (error) {
      console.error('Error al modificar el mesero:', error);
      alert('Hubo un error al intentar modificar el mesero.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl m-4">Lista de Meseros</h1>
      <div className="container mx-auto p-4 flex-grow overflow-y-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 max-h-[75%] overflow-y-auto">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Seleccionar</th>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Activo</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(meseros) && meseros.length > 0 ? (
              meseros.map((mesero) => (
                <tr key={mesero._id}>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedMesero === mesero._id}  // Marca el checkbox si el id coincide
                      onChange={() => handleCheckboxChange(mesero._id)}  // Cambia la selección
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{mesero.nombre}</td>
                  <td className="border border-gray-300 p-2">{mesero.email}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {mesero.activo ? 'Sí' : 'No'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron meseros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botones en la parte inferior */}
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

      {/* Modal para agregar un mesero */}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar un nuevo mesero</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nombre" value="Nombre" />
              </div>
              <TextInput
                id="nombre"
                placeholder="Nombre del mesero"
                onChange={(e) => setNewMesero({ ...newMesero, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                placeholder="Correo del mesero"
                onChange={(e) => setNewMesero({ ...newMesero, email: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleCreateMesero}>Crear Mesero</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para editar un mesero */}
      <Modal show={openEditModal} size="md" onClose={() => setOpenEditModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Editar mesero</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nombre" value="Nombre" />
              </div>
              <TextInput
                id="nombre"
                placeholder="Nombre del mesero"
                value={newMesero.nombre}
                onChange={(e) => setNewMesero({ ...newMesero, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                placeholder="Correo del mesero"
                value={newMesero.email}
                onChange={(e) => setNewMesero({ ...newMesero, email: e.target.value })}
                required
              />
            </div>
            <div className="w-full">
              <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleUpdateMesero}>Actualizar Mesero</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Meseros;