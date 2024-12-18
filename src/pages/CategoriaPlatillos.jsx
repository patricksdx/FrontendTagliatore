"use client";

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../api/auth"; // Ajusta la ruta si es necesario

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [newCategoria, setNewCategoria] = useState({
        nombre: "",
        descripcion: "",
    });
    const [searchName, setSearchName] = useState(""); // Campo de búsqueda por nombre

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const response = await getCategorias();
            setCategorias(response);
        } catch (error) {
            console.error("Error al obtener categorías:", error);
        }
    };

    const handleSearchChange = (e) => setSearchName(e.target.value);

    const handleSearch = () => {
        if (searchName.trim() === "") {
            fetchCategorias(); // Si la búsqueda está vacía, mostrar todas las categorías
        } else {
            setCategorias(categorias.filter(categoria => categoria.nombre.toLowerCase().includes(searchName.toLowerCase())));
        }
    };

    const handleAdd = () => {
        setOpenModal(true);
    };

    const handleEdit = (categoria) => {
        setNewCategoria({
            nombre: categoria.nombre, // Nombre original
            nuevoNombre: categoria.nombre, // Inicialmente igual al nombre original
            nuevaDescripcion: categoria.descripcion, // Descripción actual
        });
        setOpenEditModal(true);
    };

    const handleCreateCategoria = async () => {
        if (!newCategoria.nombre || !newCategoria.descripcion) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        try {
            const response = await createCategoria(newCategoria);
            setCategorias((prevCategorias) => [...prevCategorias, response.data]);
            setOpenModal(false);
            setNewCategoria({ nombre: "", descripcion: "" });
            alert("Categoría creada correctamente.");
            fetchCategorias(); // Recarga la lista de categorías
        } catch (error) {
            console.error("Error al crear la categoría:", error);
            alert("Hubo un error al intentar crear la categoría.");
        }
    };

    const handleUpdateCategoria = async () => {
        try {
            const response = await updateCategoria(newCategoria);
            console.log(response);
            setCategorias((prevCategorias) =>
                prevCategorias.map((categoria) =>
                    categoria._id === newCategoria.id ? { ...categoria, ...newCategoria } : categoria
                )
            );
            setOpenEditModal(false);
            setNewCategoria({ nombre: "", descripcion: "" });
            alert("Categoría actualizada correctamente.");
            fetchCategorias();
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            alert("Hubo un error al intentar actualizar la categoría.");
        }
    };

    const handleDeleteCategoria = async (id) => {
        try {
            await deleteCategoria(id);
            setCategorias(categorias.filter((categoria) => categoria._id !== id));
            alert("Categoría eliminada correctamente.");
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            alert("Hubo un error al intentar eliminar la categoría.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <h1 className="text-2xl m-4">Lista de Categorías</h1>

            <div className="mb-4 p-4 flex items-center space-x-2">
                <TextInput
                    id="search"
                    placeholder="Buscar por nombre"
                    value={searchName}
                    onChange={handleSearchChange}
                />
                <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={handleSearch}>Buscar</Button>
                <Button className="bg-green-500 text-white hover:bg-green-600" onClick={handleAdd}>Agregar Categoría</Button>
            </div>

            <div className="container mx-auto p-4 flex-grow overflow-y-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Nombre</th>
                            <th className="border border-gray-300 p-2">Descripción</th>
                            <th className="border border-gray-300 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categorias.length > 0 ? (
                            categorias.map((categoria) => (
                                <tr key={categoria._id}>
                                    <td className="border border-gray-300 p-2">{categoria.nombre}</td>
                                    <td className="border border-gray-300 p-2">{categoria.descripcion}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleEdit(categoria)}>Modificar</Button>
                                        <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleDeleteCategoria(categoria._id)}>Eliminar</Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">
                                    No se encontraron categorías
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal para agregar categoría */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="flex">
                        <div className="w-1/2 pr-4">
                            <Label htmlFor="nombre" value="Nombre de la Categoría" />
                            <TextInput
                                id="nombre"
                                value={newCategoria.nombre}
                                onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
                                required
                            />
                            <Label htmlFor="descripcion" value="Descripción" className="mt-4" />
                            <TextInput
                                id="descripcion"
                                value={newCategoria.descripcion}
                                onChange={(e) => setNewCategoria({ ...newCategoria, descripcion: e.target.value })}
                                required
                            />
                            <Button
                                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleCreateCategoria}
                            >
                                Crear Categoría
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal para editar categoría */}
            <Modal show={openEditModal} onClose={() => setOpenEditModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="flex">
                        <div className="w-1/2 pr-4">
                            <Label htmlFor="nombre" value="Nombre de la Categoría" />
                            <TextInput
                                id="nuevoNombre"
                                value={newCategoria.nuevoNombre} // Campo para el nuevo nombre
                                onChange={(e) => setNewCategoria({ ...newCategoria, nuevoNombre: e.target.value })}
                                required
                            />
                            <TextInput
                                id="nuevaDescripcion"
                                value={newCategoria.nuevaDescripcion} // Campo para la nueva descripción
                                onChange={(e) => setNewCategoria({ ...newCategoria, nuevaDescripcion: e.target.value })}
                                required
                            />
                            <Button
                                className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleUpdateCategoria}
                            >
                                Actualizar Categoría
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Categorias;