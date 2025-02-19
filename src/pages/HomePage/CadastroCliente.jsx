import { useState } from "react";
import Banner from "../../componentes/Banner";
import Formulario from "../../componentes/Formulario";

const CadastroCliente = () => {
  const times = [
    { nome: "Desenvolvimento de Sites e Aplicativos Web" },
    { nome: "Desenvolvimento de Aplicativos Móveis (Android/iOS)" },
    { nome: "Data-Science" },
    { nome: "Devops" },
    { nome: "UX e Design" },
    { nome: "Mobile" },
    { nome: "Inovação e Gestão" },
  ];

  const [colaboradores, setColaboradores] = useState([]);

  const aoNovoColaboradorAdicionado = (colaborador) => {
    setColaboradores([...colaboradores, colaborador]);
    console.log("Novo colaborador adicionado:", colaborador);
  };

  return (
    <div>
      <Banner />
      <Formulario
        servicos={times.map((time) => time.nome)}
        aoColaboradorCadastrado={aoNovoColaboradorAdicionado}
      />
    </div>
  );
};

export default CadastroCliente;
