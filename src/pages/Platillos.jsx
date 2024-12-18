"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { getPlatillos, createPlatillo, updatePlatillo, deletePlatillo } from "../api/auth"; // Ajusta la ruta si es necesario

function Platillos() {
  const [platillos, setPlatillos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newPlatillo, setNewPlatillo] = useState({
    nombre: "",
    ingredientes: "",
    precio: "",
    imagenes: "",
  });
  const [searchName, setSearchName] = useState(""); // Campo de búsqueda por nombre

  useEffect(() => {
    fetchPlatillos();
  }, []);

  const fetchPlatillos = async () => {
    try {
      const response = await getPlatillos();
      setPlatillos(response);
    } catch (error) {
      console.error("Error al obtener platillos:", error);
    }
  };

  const handleSearchChange = (e) => setSearchName(e.target.value);

  const handleSearch = () => {
    if (searchName.trim() === "") {
      fetchPlatillos(); // Si la búsqueda está vacía, mostrar todos los platillos
    } else {
      setPlatillos(platillos.filter(platillo => platillo.nombre.toLowerCase().includes(searchName.toLowerCase())));
    }
  };

  const handleAdd = () => {
    setOpenModal(true);
  };

  const handleEdit = (platillo) => {
    setNewPlatillo({
      id: platillo._id,
      nombre: platillo.nombre,
      ingredientes: Array.isArray(platillo.ingredientes)
        ? platillo.ingredientes.join(", ") // Si es un array, usamos join()
        : platillo.ingredientes ? platillo.ingredientes.toString() : '', // Convertimos a string si no es un array
      precio: platillo.precio,
      imagenes: Array.isArray(platillo.imagenes)
        ? platillo.imagenes.join(", ")
        : platillo.imagenes ? platillo.imagenes.toString() : '', // Lo mismo para las imágenes
    });
    setOpenEditModal(true);
  };

  const handleCreatePlatillo = async () => {
    if (!newPlatillo.nombre || !newPlatillo.precio || !newPlatillo.ingredientes || !newPlatillo.imagenes) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await createPlatillo({
        ...newPlatillo,
        ingredientes: newPlatillo.ingredientes.split(",").map(ing => ing.trim()), // Convertir a array de ingredientes
        imagenes: newPlatillo.imagenes.split(",").map(img => img.trim()), // Convertir a array de imágenes
      });
      setPlatillos((prevPlatillos) => [...prevPlatillos, response.data]);
      setOpenModal(false);
      setNewPlatillo({ nombre: "", ingredientes: "", precio: "", imagenes: "" });
      alert("Platillo creado correctamente.");
      fetchPlatillos();  // Recarga la lista de platillos
    } catch (error) {
      console.error("Error al crear el platillo:", error);
      alert("Hubo un error al intentar crear el platillo.");
    }
  };

  const handleUpdatePlatillo = async () => {
    try {
      const response = await updatePlatillo({
        ...newPlatillo,
        ingredientes: newPlatillo.ingredientes.split(",").map(ing => ing.trim()),
        imagenes: newPlatillo.imagenes.split(",").map(img => img.trim()),
      });

      console.log(response)

      setPlatillos((prevPlatillos) =>
        prevPlatillos.map((platillo) =>
          platillo._id === newPlatillo.id ? { ...platillo, ...newPlatillo } : platillo
        )
      );
      setOpenEditModal(false);
      setNewPlatillo({ nombre: "", ingredientes: "", precio: "", imagenes: "" });
      alert("Platillo actualizado correctamente.");
      fetchPlatillos();
    } catch (error) {
      console.error("Error al actualizar el platillo:", error);
      alert("Hubo un error al intentar actualizar el platillo.");
    }
  };

  const handleDeletePlatillo = async (id) => {
    try {
      await deletePlatillo(id);
      setPlatillos(platillos.filter((platillo) => platillo._id !== id));
      alert("Platillo eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el platillo:", error);
      alert("Hubo un error al intentar eliminar el platillo.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl m-4">Lista de Platillos</h1>

      <div className="mb-4 p-4 flex items-center space-x-2">
        <TextInput
          id="search"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={handleSearchChange}
        />
        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSearch}>Buscar</Button>
        <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleAdd}>Agregar Platillo</Button>
      </div>

      <div className="container mx-auto p-4 flex-grow overflow-y-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Nombre</th>
              <th className="border border-gray-300 p-2">Precio</th>
              <th className="border border-gray-300 p-2">Ingredientes</th>
              <th className="border border-gray-300 p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platillos.length > 0 ? (
              platillos.map((platillo) => (
                <tr key={platillo._id}>
                  <td className="border border-gray-300 p-2">{platillo.nombre}</td>
                  <td className="border border-gray-300 p-2">${platillo.precio}</td>
                  <td className="border border-gray-300 p-2">
                    {Array.isArray(platillo.ingredientes) ? platillo.ingredientes.join(", ") : platillo.ingredientes}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleEdit(platillo)}>Modificar</Button>
                    <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleDeletePlatillo(platillo._id)}>Eliminar</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No se encontraron platillos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar platillo */}
      <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <Label htmlFor="nombre" value="Nombre del Platillo" />
              <TextInput
                id="nombre"
                value={newPlatillo.nombre}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, nombre: e.target.value })}
                required
              />
              <Label htmlFor="precio" value="Precio" className="mt-4" />
              <TextInput
                id="precio"
                type="number"
                value={newPlatillo.precio}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, precio: e.target.value })}
                required
              />
              <Label htmlFor="ingredientes" value="Ingredientes" className="mt-4" />
              <TextInput
                id="ingredientes"
                value={newPlatillo.ingredientes}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, ingredientes: e.target.value })}
                required
              />
              <Label htmlFor="imagenes" value="Imágenes" className="mt-4" />
              <TextInput
                id="imagenes"
                value={newPlatillo.imagenes}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, imagenes: e.target.value })}
                required
              />
              <Button
                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleCreatePlatillo}
              >
                Crear Platillo
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal para editar platillo */}
      <Modal show={openEditModal} onClose={() => setOpenEditModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="flex">
            <div className="w-1/2 pr-4">
              <Label htmlFor="nombre" value="Nombre del Platillo" />
              <TextInput
                id="nombre"
                value={newPlatillo.nombre}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, nombre: e.target.value })}
                required
              />
              <Label htmlFor="precio" value="Precio" className="mt-4" />
              <TextInput
                id="precio"
                type="number"
                value={newPlatillo.precio}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, precio: e.target.value })}
                required
              />
              <Label htmlFor="ingredientes" value="Ingredientes" className="mt-4" />
              <TextInput
                id="ingredientes"
                value={newPlatillo.ingredientes}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, ingredientes: e.target.value })}
                required
              />
              <Label htmlFor="imagenes" value="Imágenes" className="mt-4" />
              <TextInput
                id="imagenes"
                value={newPlatillo.imagenes}
                onChange={(e) => setNewPlatillo({ ...newPlatillo, imagenes: e.target.value })}
                required
              />
              <Button
                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleUpdatePlatillo}
              >
                Actualizar Platillo
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Platillos;