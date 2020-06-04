import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';


import './styles.css'; //pode importar diretamente o caminho do arquivo, já que ele não vai ser chamado dentro deste componenente

import logo from '../../assets/logo.svg';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                <header>
                    <img src={logo} alt="Logotipo do projeto"/>
                </header>

                <main>
                    <h1>Apoie os negócios locais</h1>
                    <p>Seja durante a quarentena ou depois, dê preferência a pequenos negócios locais. Juntos vamos fortalecer nossas redes e enfraquecer as cadeias de exploração do trabalho.</p>

                    <Link to="/cadastrar-negocio">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre um negócio local</strong>
                    </Link>
                </main>
            </div>
        </div>
    )
}

export default Home;