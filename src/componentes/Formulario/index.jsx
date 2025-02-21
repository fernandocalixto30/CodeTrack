import "./Formulario.css";
import CampoTexto from "../CampoTexto/index.jsx";
import ListaSuspensa from "../ListaSuspensa/index.jsx";
import Botao from "../Botao/index.jsx";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient.js";
import { useNavigate } from "react-router-dom";


const Formulario = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [imagem, setImagem] = useState("");
  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [file, setFile] = useState(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();
  const tiposDeCliente = ["", "Pessoa Física", "Pessoa Jurídica"];
  const tiposDeServico = [
    "",
    "Desenvolvimento de Software de Gestão Empresarial",
    "Desenvolvimento de Aplicativos Desktop (Windows/Linux/MacOS)",
    "Desenvolvimento de Software para Internet das Coisas (IoT)",
    "Desenvolvimento de Sites e Aplicativos Web",
    "Desenvolvimento de Aplicativos Móveis (Android/iOS)",
    "Desenvolvimento de APIs e Integrações",
    "Manutenção e Suporte em Sistemas Web e Móveis",
    "Consultoria em Desenvolvimento de Software",
    "Gestão de Redes Sociais",
    "Criação de E-commerce e Lojas Virtuais",
    "Outros",
  ];

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagem(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagem("");
    }
  }, [file]);

  const aoSalvar = async (evento) => {
    evento.preventDefault();

    setErro(""); 
    setSucesso(""); 

    const user = await supabase.auth.getUser();
    if (!user || !user.data.user) {
      setErro("Usuário não autenticado. Faça login em sua conta e tente novamente.");
      return;
    }

    const user_id = user.data.user.id;

    const { error } = await supabase.from("clientes").insert([
      { user_id, nome, telefone, imagem, cliente, servico }
    ]);

    if (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setErro(error.message);
    } else {
      setSucesso("Cliente cadastrado com sucesso!");
      console.log(nome, telefone, imagem, cliente)
      setTimeout(() => {
        setSucesso("");
        navigate("/")

      }, 1000);

      setNome("");
      setTelefone("");
      setCliente("");
      setServico("");
      setFile(null);
      setImagem("");
    }
  };

  return (
    <section className="formulario">
      <form onSubmit={aoSalvar}>
        <h2>Preencha os dados para o Cadastro do seu cliente.</h2>

        {erro && <div className="container-erro"><span className="erro-auth">{erro}</span></div>}
        {sucesso && <div className="container-sucesso"><span className="sucesso-auth">{sucesso}</span></div>}

        <div className="input-file-container">
          {imagem ? <img src={imagem} className="img-cliente" /> : ""}
          <div className="input-file-content">
            <label htmlFor="user-file" className="label-file">Escolher Foto</label>
            <input
              type="file"
              accept="image/*"
              className="input-file"
              id="user-file"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </div>

        <ListaSuspensa
          valor={cliente}
          aoAlterado={setCliente}
          itens={tiposDeCliente}
          label="Selecione o tipo de cliente"
        />

        <CampoTexto
          valor={nome}
          aoAlterado={setNome}
          label="Nome"
          placeholder={`Digite ${cliente
            ? cliente === "Pessoa Física"
              ? "o nome da pessoa"
              : "o nome da empresa ou instituição"
            : ""
            }`}
        />

        <CampoTexto
          type="tel"
          valor={telefone}
          aoAlterado={setTelefone}
          label="Telefone"
          placeholder="O telefone deve coresponder a (xx) XXXX XXXX"
          patern="^\(\d{2}\)\s\d{4,5}\s\d{4}$"
        />

        <ListaSuspensa
          valor={servico}
          aoAlterado={setServico}
          itens={tiposDeServico}
          label="Serviço"
        />

        <Botao texto="Cadastrar" />
      </form>
    </section>
  );
};

export default Formulario;
