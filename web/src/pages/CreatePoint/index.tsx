import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import api from '../../services/api';

import './styles.css';

import logo from '../../assets/logo.svg';

import Dropzone from '../../components/Dropzone';

interface Category {
    id: number,
    name: string,
    image_url: string
}


const CreatePoint = () => {

    const [categories, setCategories] = useState<Category[]>([]);


    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedCategory, setSelectedCategory] = useState<number>(0);

    const [selectedFile, setSelectedFile] = useState<File>();
    
    const [formData, setFormData] = useState({
        biz_name: '',
        email: '',
        whatsapp: '',
        working_hours: '',
        instagram: '',
        facebook: '',
        site: '',
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

        const { 
            biz_name, 
            email, 
            whatsapp, 
            working_hours, 
            instagram, 
            facebook,
            site,
            neighborhood, 
            full_address, 
            curator_review 
        } = formData;

        const state = 'RS';

        const city = 'Porto Alegre';

        const [latitude, longitude] = selectedPosition;

        const category = selectedCategory;

        if ( biz_name !== '' && latitude !== 0 && longitude !== 0 && category !== 0 ) {

            const data = new FormData();

            data.append('biz_name', biz_name);
            data.append('email', email);
            data.append('whatsapp', whatsapp);
            data.append('working_hours', working_hours); 
            data.append('instagram', instagram); 
            data.append('facebook', facebook);
            data.append('site', site);
            data.append('neighborhood', neighborhood); 
            data.append('full_address', full_address); 
            data.append('curator_review', curator_review);
            data.append('state', state);
            data.append('city', city);
            data.append('latitude', String(latitude));
            data.append('longitude', String(longitude));
            data.append('category', String(category));
            
            if (selectedFile) {
                data.append('image', selectedFile);    
            }

            api.post('negocios-locais', data);

            alert('Negócio cadastrado!');

            history.push('/');

        } else {
            alert('Verifique se algum campo obrigatório está vazio');
        }       

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
                <span>
                    Os campos obrigatórios estão marcados com *<br />
                    Os outros são opcionais, mas tente dar o máximo de informações :)
                </span>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="biz_name">Nome do negócio*</label>
                        <input
                            type="text"
                            name="biz_name"
                            id="biz_name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp*</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}
                                maxLength={11}
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
                    <div className="field">
                        <label htmlFor="site">Site</label>
                        <input type="text" name="site" id="site" onChange={handleInputChange} />
                    </div>

                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Clique no mapa para indicar o local do negócio. Você não precisa marcar o ponto exato, mas marque um ponto para indicar a região do negócio</span>
                    </legend>

                    <Map center={initialPosition} zoom={13} onClick={handleMapClick} >
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="state">Estado*</label>
                            <input type="text" name="state" id="state" value="RS" placeholder="RS" disabled />
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade*</label>
                            <input type="text" name="city" id="city" value="Porto Alegre" placeholder="Porto Alegre" disabled />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="neighborhood">Bairro*</label>
                        <input 
                            type="text"
                            name="neighborhood"
                            id="neighborhood"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="full_address">Endereço completo</label>
                        <small>Se informada, essa informação aparecerá na página do negócio</small>
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
                        <h2>Imagem*</h2>
                        <span>Envie alguma imagem do negócio, seja real ou representativa (visite o site <a href="https://www.unsplash.com" target="blank">Unsplash</a> para procurar fotos gratuitas).</span>
                    </legend>


                    <Dropzone onFileUploaded={setSelectedFile} />                
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Categoria*</h2>
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
                        <h2>Review do Curador*</h2>
                        <span>Sua descrição pessoal e objetiva do negócio. Se quiser, fale algo sobre as pessoas que fazem ele acontecer</span>
                    </legend>
                    
                    <div className="field">
                        <label htmlFor="curator_review">Review</label>
                        <textarea name="curator_review" id="curator_review" rows={5} onChange={handleTextareaChange}></textarea>
                    </div>

                </fieldset>

                <div className="buttonContainer">
                	<button type="submit">Cadastrar</button>
                </div>
                
            </form>
        </div>       
    )
}

export default CreatePoint;

