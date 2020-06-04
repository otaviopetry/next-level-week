import React, { useEffect, useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Category {
    id: number,
    name: string,
    image_url: string
}

interface IBGEUfResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);



    useEffect( () => {
        navigator.geolocation.getCurrentPosition( position => {
            const { latitude, longitude} = position.coords;

            setInitialPosition([latitude, longitude]);
        })
    }, []);

    useEffect(() => {
        api.get('categorias').then(response => {
            setCategories(response.data);
        })
    }, []); // deixando o segundo parâmetro como um array vazio, vai ser executado apenas uma vez


    useEffect( () => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then( response => {
            const ufInitials = response.data.map( uf => uf.sigla );

            setUfs(ufInitials);
        });
    }, []);


    useEffect( () => {
        if (selectedUf === '0') {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=id`)
            .then( response => {
                const cityNames = response.data.map( city => city.nome);

                setCities(cityNames);

            });
    }, [selectedUf]);

    function handleSelectUf (event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity (event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick (event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat, event.latlng.lng
        ])
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Logotipo do projeto"/>

                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro de negócio</h1>                

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="businessName">Nome do negócio</label>
                        <input
                            type="text"
                            name="businessName"
                            id="businessName"
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="emailAddress">E-mail (opcional)</label>
                            <input
                                type="email"
                                name="emailAddress"
                                id="emailAddress"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="businessName">Whatsapp</label>
                            <input
                                type="text"
                                name="Whatsapp"
                                id="Whatsapp"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="working_hours">Horários de funcionamento</label>
                        <textarea name="working_hours" id="working_hours"></textarea>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="instagram">Instagram</label>
                            <input 
                                type="text"
                                name="instagram"
                                id="instagram"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="facebook">Facebook</label>
                            <input 
                                type="text"
                                name="facebook"
                                id="facebook"
                            />
                        </div>
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="state">Estado</label>
                            <select name="state" id="state" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))};
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map( city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="neighborhood">Bairro</label>
                        <input 
                            type="text"
                            name="neighborhood"
                            id="neighborhood"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="fullAddress">Endereço completo (opcional)</label>
                        <small>Se informado, esse informação aparecerá no cabeçalho da página do negócio</small>
                        <input 
                            type="text"
                            name="fullAddress"
                            id="fullAddress"
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Categoria</h2>
                        <span>Selecione a categoria</span>
                    </legend>

                    <ul className="items-grid">
                        {categories.map(category => (
                            <li key={category.id}>
                                <img src={category.image_url} alt="Ícone da categoria" />
                                <span>{category.name}</span>
                            </li>
                        ))}
                        
                    </ul>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Review do Curador</h2>
                    </legend>
                    
                    <div className="field">
                        <label htmlFor="curator_review">Descrição pessoal sobre o negócio</label>
                        <textarea name="curator_review" id="curator_review" rows={5}></textarea>
                    </div>

                </fieldset>

                <button type="submit">Cadastrar</button>
                
            </form>
        </div>       
    )
}


// name,
// neighborhood,
// street,
// latitude,
// longitude,
// city,
// state,
// working_hours,
// email,
// whatsapp,
// category,
// curator_review

export default CreatePoint;

