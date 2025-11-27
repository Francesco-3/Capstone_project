import { useState, useEffect } from "react";
// Assicurati di importare il tuo logo effettivo, qui uso un placeholder SVG e un logo fittizio
import { Navbar, Container, Form, Nav, Image, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import userAvatar from '../assets/image/user.png'

export default function CustomNavbar() {
    const [user] = useState({ username: 'Mario Rossi' }); // Modificato per visualizzare il nome utente
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const dangerColor = { color: "var(--danger, #dc3545)" };

    // Stile definito per il logo testuale
    const brandTextStyle = {
        fontSize: '1.25rem', // Dimensione del font leggermente aumentata
        fontWeight: 800, // Più grassetto per risalto
        color: 'var(--primary, #007bff)', // Colore primario o distintivo
        letterSpacing: '0.5px',
        textTransform: 'uppercase' // Rende il testo più audace
    };

    useEffect(() => {
        //let filtered;
        if (searchTerm === "") {
       // filtered = users;
        } else {
       // const lowerTerm = searchTerm.toLowerCase();
       /* filtered = users.filter(
            (p) =>
            p.username.toLowerCase().includes(lowerTerm) ||
            p.role.toLowerCase().includes(lowerTerm)
        );*/
        }
        
    }, [searchTerm]);

    return (
        <Navbar expand="lg" style={{ border: "var(--border)", background: "var(--card-bg)", borderRadius: "0.5rem" }}>
            <Container fluid>
                {/* 1. Logo con Nome a Sinistra (Migliorato) */}
                <Navbar.Brand 
                    as={Link} 
                    to="/engineer" 
                    className="d-flex align-items-center me-4" // Aggiunto margine a destra
                >
                    {/* Placeholder SVG per l'Icona del Logo (Design Industry) */}
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="var(--primary, #007bff)" // Colore coordinato
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="me-2"
                        style={{ minWidth: '24px' }} // Evita che l'icona si rimpicciolisca
                    >
                        <circle cx="12" cy="12" r="3"/><path d="M19.7 7.35A10 10 0 0 0 12 2v2a8 8 0 0 1 7.7 7.7L12 12l7.7-7.7z"/><path d="M4.3 16.65A10 10 0 0 0 12 22v-2a8 8 0 0 1-7.7-7.7L12 12l-7.7 7.7z"/>
                    </svg>

                    {/* Nome Azienda con Stile Personalizzato */}
                    <span style={brandTextStyle}>Mechanista WMS</span>
                </Navbar.Brand>
                
                {/* 2. Search Bar al Centro (Rimasto Invariato) */}
                <div className="d-flex justify-content-center">
                    <Card className="border-0 p-0">
                        <Card.Body>
                        {/* INPUT RICERCA */}
                        <Form className="search-form d-flex align-items-center position-relative" onSubmit={(e) => e.preventDefault()}>
                            <button className='border-0 bg-transparent' style={{ color: "#8b8ba7"}}>
                            <svg width="17" height="15" className="mb-1" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="search">
                                <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth={1.333} strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                            </button>

                            <input className="input w-100 h-100 border-0" placeholder="Cerca per nome..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                            <button className='reset border-0 bg-transparent' style={{ color: "#8b8ba7" }} type="button" onClick={() => setSearchTerm("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="mb-1" width="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            </button>
                        </Form>
                        </Card.Body>
                    </Card>
                </div>


                {/* 3. Immagine Profilo, Nome e Tasto Esci a Destra (Corretto) */}
                <Nav className="d-flex align-items-center">
                    <Nav.Link 
                        as={Link} 
                        to="me" 
                        // Corretto l'uso delle classi, rimosso fs-4, aggiunto text-dark
                        className={(location.pathname === "/engineer/me" ? "active " : "") + "d-flex gap-2 align-items-center text-dark"} 
                    >
                        <div className="avatar_name fw-bold fs-6 link">{user?.username || "Profilo"}</div> 
                        <div className="avatar_wrapper d-flex">
                            <Image 
                                src={userAvatar} 
                                alt="Avatar" 
                                className="avatar d-block pointer" 
                                roundedCircle 
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                        </div>
                        {/* Dimensione font più adatta per la navbar */}
                    </Nav.Link>

                    {/* Tasto Esci */}
                    <Nav.Link href="/login" className="logout ms-3 d-flex gap-2 align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" height="24" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" style={dangerColor}/>
                        <polyline points="16 17 21 12 16 7" style={dangerColor}/>
                        <line x1="21" y1="12" x2="9" y2="12" style={dangerColor}/>
                        </svg>
                        {/* Rimosso mt-2 e fs-5 per allineamento e dimensione più uniformi */}
                        <span className="link" style={dangerColor}>Esci</span> 
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}