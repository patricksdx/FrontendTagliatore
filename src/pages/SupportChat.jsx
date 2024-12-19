import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Conectar con el servidor
const socket = io('http://localhost:3000/chat');

const ChatAdmin = () => {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    // Verificar si la conexión se establece correctamente
    socket.on('connect', () => {
      console.log('Administrador conectado con el id:', socket.id);
      socket.emit('identificarRol', 'Admin');  // Identificar como Admin
    });

    // Escuchar los mensajes del cliente
    socket.on('mensajeCliente', (data) => {
      if (data.from === 'Cliente') {
        console.log('Mensaje recibido del cliente:', data);
        setMensajes((prevMensajes) => [
          ...prevMensajes,
          { msg: data.msg, from: 'Cliente' }, // Mostrar solo mensajes del cliente
        ]);
      }
    });

    // Limpiar eventos al desconectar
    return () => {
      socket.off('mensajeCliente');
    };
  }, []);

  const handleSendMessage = () => {
    if (mensaje.trim()) {
      // Enviar mensaje al servidor como 'Admin'
      console.log('Enviando mensaje al servidor:', mensaje);
      socket.emit('mensajeAdmin', { msg: mensaje, from: 'Admin' });
      setMensajes((prevMensajes) => [
        ...prevMensajes,
        { msg: mensaje, from: 'Admin' }, // Mostrar mensaje del admin
      ]);
      setMensaje('');
    }
  };

  return (
    <div>
      <h2>Chat con el Cliente</h2>
      <div
        style={{
          height: '300px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '10px',
        }}
      >
        {mensajes.map((mensaje, index) => (
          <div
            key={index}
            style={{
              textAlign: mensaje.from === 'Admin' ? 'right' : 'left',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: mensaje.from === 'Admin' ? 'flex-end' : 'flex-start',
            }}
          >
            <p
              style={{
                backgroundColor: mensaje.from === 'Admin' ? '#c1f7c1' : '#f1f1f1',
                display: 'inline-block',
                padding: '8px 15px',
                borderRadius: '10px',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              <strong>{mensaje.from}:</strong> {mensaje.msg}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe tu mensaje"
        style={{ width: '80%', padding: '8px' }}
      />
      <button onClick={handleSendMessage} style={{ width: '18%', padding: '8px' }}>
        Enviar
      </button>
    </div>
  );
};

export default ChatAdmin;