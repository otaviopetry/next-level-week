import React from 'react';

interface HeaderProps {
    title: string //se não quiser que seja obrigatória -> title?: string
}

const Header: React.FC = () => {
    return (
        <header>
            <h1>Negócios locais POA</h1>            
        </header>
    );
}

export default Header;