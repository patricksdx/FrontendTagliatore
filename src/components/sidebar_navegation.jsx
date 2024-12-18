import { Sidebar } from "flowbite-react";
import { FiAlignLeft } from "react-icons/fi";
import { MdOutlineTableBar } from "react-icons/md";
import { GoListUnordered } from "react-icons/go";
import { RiCustomerService2Fill } from "react-icons/ri";
import { BiDish } from "react-icons/bi";
import { CiChat1 } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosExit } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Sidebar_Navigation() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  const { logout } = useAuth();

  return (
    <div className="relative">
      <button
        className="mt-4 ms-4 lg:hidden"
        onClick={toggleSidebar}
      >
        <FiAlignLeft className="text-3xl" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <Sidebar
        aria-label="Sidebar with logo branding example"
        className={`transition-transform fixed top-0 left-0 h-full bg-white z-50 lg:relative lg:block ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <Sidebar.Logo href="/" img="/vite.svg" imgAlt="Flowbite logo">
          Tagliatore
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup className="mb-10">
            <Sidebar.Item href="/" icon={IoHomeOutline}>
              Inicio
            </Sidebar.Item>
            <Sidebar.Item href="/Ordenes" icon={GoListUnordered}>
              Ordenes
            </Sidebar.Item>
            <Sidebar.Item href="/Meseros" icon={MdOutlineTableBar}>
              Meseros
            </Sidebar.Item>
            <Sidebar.Item href="/Clientes" icon={RiCustomerService2Fill}>
              Clientes
            </Sidebar.Item>
            <Sidebar.Item href="/Platillos" icon={BiDish}>
              Platillos
            </Sidebar.Item>
            <Sidebar.Item href="/Categorias" icon={FaClipboardList}>
              Categorias Platillos
            </Sidebar.Item>
            <Sidebar.Item href="/Chat" icon={CiChat1}>
              Chat
            </Sidebar.Item>
          </Sidebar.ItemGroup>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="" onClick={() => logout()} icon={IoIosExit}>
              Logout
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}

export default Sidebar_Navigation;