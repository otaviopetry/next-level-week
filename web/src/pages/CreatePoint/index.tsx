import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
    const [selectedCategory, setSelectedCategory] = useState<number>(0);
    
    const [formData, setFormData] = useState({
        biz_name: '',
        email: '',
        whatsapp: '',
        working_hours: '',
        instagram: '',
        facebook: '',
        neighborhood: '',
        full_address: '',
        curator_review: ''        
    })

    const history = useHistory();

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

    function handleInputChange (event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData,  [name]: value});

    }

    function handleTextareaChange (event: ChangeEvent<HTMLTextAreaElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData,  [name]: value});

    }

    function handleSelectItem (id: number) {

        if ( selectedCategory === id ) {

            setSelectedCategory(0);

        } else {
            setSelectedCategory(id);
        }
    }

    function handleSubmit (event: FormEvent) {

        event.preventDefault();

        console.log('ihaaaaaaaaaaaaaaaaaaa');

        const { 
            biz_name, 
            email, 
            whatsapp, 
            working_hours, 
            instagram, 
            facebook, 
            neighborhood, 
            full_address, 
            curator_review 
        } = formData;

        const state = selectedUf;

        const city = selectedCity;

        const [latitude, longitude] = selectedPosition;

        const category = selectedCategory;

        const data = {
            biz_name,
            email,
            whatsapp,
            working_hours, 
            instagram, 
            facebook, 
            neighborhood, 
            full_address, 
            curator_review,
            state,
            city,
            latitude,
            longitude,
            category
        }

        api.post('negocios-locais', data);

        alert('Ponto de coleta criado');

        history.push('/');

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

            <form onSubmit={handleSubmit}>
                <h1>Cadastro de negócio</h1>                

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="biz_name">Nome do negócio</label>
                        <input
                            type="text"
                            name="biz_name"
                            id="biz_name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail (opcional)</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="working_hours">Horários de funcionamento</label>
                        <textarea name="working_hours" id="working_hours" onChange={handleTextareaChange}></textarea>
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="instagram">Instagram</label>
                            <input 
                                type="text"
                                name="instagram"
                                id="instagram"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="facebook">Facebook</label>
                            <input 
                                type="text"
                                name="facebook"
                                id="facebook"
                                onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="full_address">Endereço completo (opcional)</label>
                        <small>Se informado, essa informação aparecerá no cabeçalho da página do negócio</small>
                        <input 
                            type="text"
                            name="full_address"
                            id="full_address"
                            onChange={handleInputChange}
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
                            <li 
                                key={category.id} 
                                onClick={ () => handleSelectItem(category.id) }
                                className={ selectedCategory === category.id ? 'selected' : '' }
                            >
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
                        <textarea name="curator_review" id="curator_review" rows={5} onChange={handleTextareaChange}></textarea>
                    </div>

                </fieldset>

                <button type="submit">Cadastrar</button>
                
            </form>
        </div>       
    )
}

export default CreatePoint;

