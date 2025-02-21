import { useState, useEffect } from "react";
import Banner from "../../componentes/Banner";
import Pesquisa from "../../componentes/search";
import ItemCliente from "../../componentes/item-cliente";
import ModalConfirmacao from "../../componentes/ModalConfirmacao";
import './style.css';
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";

const Clientes = () => {
  const [erro, setErro] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [filtroPessoa, setFiltroPessoa] = useState("");
  const [filtroOrdem, setFiltroOrdem] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteIdExcluir, setClienteIdExcluir] = useState(null);

  const handleDelete = async () => {
    try {
    setCarregando(true);
      if (!clienteIdExcluir) {
        console.error("ID do cliente não encontrado.");
        setErro("Erro ao deletar cliente. ID não encontrado.");
        return;
      }

      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteIdExcluir);

      if (error) throw error;

      setClientes(clientes.filter(cliente => cliente.id !== clienteIdExcluir));
      setMostrarModal(false); 
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      setErro("Erro ao deletar cliente. Tente novamente.");
    }
  };

  const cancelarExclusao = () => {
    setMostrarModal(false);
    setClienteIdExcluir(null); 
  };

  useEffect(() => {
    const buscarClientes = async () => {
      try {
        setCarregando(true);
        setErro(null);

        const user = await supabase.auth.getUser();
        if (!user.data.user) {
          setErro("Usuário não autenticado.");
          setCarregando(false);
          return;
        }

        let query = supabase
          .from("clientes")
          .select("id, cliente, nome, servico, telefone, imagem")
          .eq("user_id", user.data.user.id);

 
        let filtroCorreto = null;
        if (filtroPessoa === "fisica") {
          filtroCorreto = "Pessoa Física";
        } else if (filtroPessoa === "juridica") {
          filtroCorreto = "Pessoa Jurídica";
        }

      
        if (filtroCorreto) {
          query = query.eq("cliente", filtroCorreto);
        }

        const { data, error } = await query;
        if (error) throw error;

    
        let clientesOrdenados = data;
        if (filtroCorreto) {
          clientesOrdenados = [
            ...data.filter((c) => c.cliente === filtroCorreto),
            ...data.filter((c) => c.cliente !== filtroCorreto),
          ];
        }

    
        if (filtroOrdem === "ordem-alfabetica") {
          clientesOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (filtroOrdem === "ordem-cadastro") {
          clientesOrdenados.sort((a, b) => a.id - b.id);
        } else if (filtroOrdem === "ultimo-cliente") {
          clientesOrdenados.sort((a, b) => b.id - a.id);
        }

    
        const clientesFiltrados = clientesOrdenados.filter((cliente) =>
          cliente.nome.toLowerCase().includes(pesquisa.toLowerCase())
        );

        setClientes(clientesFiltrados);
 
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setErro("Erro ao buscar clientes:  Tente novamente.");
      } finally {
        setCarregando(false);
      }
    };

    buscarClientes();
  }, [filtroPessoa, filtroOrdem, pesquisa]); 

  return (
    <>
      <Banner />
      <section className="content-clientes-container">
        <div className="content-filtros-container">
          <div className="content-filtros">
            <select
              className="content-filtros__select"
              onChange={(e) => setFiltroPessoa(e.target.value)}
              value={filtroPessoa}
            >
              <option value="">Todos</option>
              <option value="fisica">Pessoa Física</option>
              <option value="juridica">Pessoa Jurídica</option>
            </select>

            <span className="content-cadastrar-user">
              <Link to="/Cadastro-clientes">Cadastrar clientes</Link>
            </span>
          </div>
          <Pesquisa setPesquisa={setPesquisa} />
        </div>

        <div className="content-clientes-container-list">
          <table className="content-clientes">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Contratante</th>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Serviço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <div className="loading">Carregando...</div>
              ) : (
                clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <ItemCliente
                      key={cliente.id}
                      cliente={cliente.cliente}
                      nome={cliente.nome}
                      telefone={cliente.telefone}
                      servico={cliente.servico}
                      imagem={cliente.imagem ? cliente.imagem : ""}
                      onDelete={setClienteIdExcluir} 
                      id={cliente.id}
                      mostrarModal={mostrarModal}
                      setMostrarModal={setMostrarModal}
                      setClienteIdExcluir={setClienteIdExcluir}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">{erro ? erro : "Nenhum cliente encontrado"}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {mostrarModal && (
        <ModalConfirmacao
        onConfirm={handleDelete}  
        onCancel={cancelarExclusao} 
     
        />
      )}
    </>
  );
};

export default Clientes;

