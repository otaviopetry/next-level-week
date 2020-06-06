import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';


import './styles.css'; //pode importar diretamente o caminho do arquivo, já que ele não vai ser chamado dentro deste componenente

import logo from '../../assets/logo.svg';
import illustration from '../../assets/home-background.svg';

const Home = () => {
    return (
        <div id="page-home">
            <div className="content">
                
                
                <div className="inner-container">
                
                	<main>
                        <header>
                            <img src={logo} alt="Logotipo do projeto" className="logo" />
                        </header>
                	    <h1>Apoie os negócios locais</h1>
                	    <p>Seja durante a quarentena ou depois, vamos fortalecer nossos pequenos negócios locais. Juntos vamos fortalecer nossas redes e tornar nossa comunidade mais forte, unida e <strong>preparada para diferentes cenários</strong>.</p>
                
                	    <Link to="/cadastrar-negocio">
                	        <span>
                	            <FiLogIn />
                	        </span>
                	        <strong>Cadastre um negócio local</strong>
                	    </Link>
                	</main>
                
                	<figure>
                	    <img src={illustration} alt="Ilustração representativa" />
                	</figure>
                </div>
            </div>
        </div>
    )
}

export default Home;