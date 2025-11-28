import { Navbar, Container, Nav, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import userAvatar from '../assets/image/user.png';

export default function CustomNavbar() {
    const username = localStorage.getItem("username");

    const location = useLocation();
    const dangerColor = { color: "var(--danger, #dc3545)" };

    const brandTextStyle = {
        fontSize: '1.25rem',
        fontWeight: 800,
        color: 'var(--steel-skin)',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
    };

    return (
        <Navbar expand="lg" style={{ border: "var(--border)", background: "var(--card-bg)", borderRadius: "0.5rem" }}>
            <Container fluid>
                <Navbar.Brand as={Link} to="/engineer" className="d-flex align-items-center me-4">

                    <svg 
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        viewBox="0 0 24 24" fill="none" stroke="var(--steel-skin)"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="me-2" style={{ minWidth: '24px' }}
                    >
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.7 7.35A10 10 0 0 0 12 2v2a8 8 0 0 1 7.7 7.7L12 12l7.7-7.7z"/>
                        <path d="M4.3 16.65A10 10 0 0 0 12 22v-2a8 8 0 0 1-7.7-7.7L12 12l-7.7 7.7z"/>
                    </svg>

                    <span style={brandTextStyle}>Mechanista WMS</span>
                </Navbar.Brand>

                <Nav className="d-flex align-items-center">
                    <Nav.Link
                        as={Link}
                        to="me"
                        className={(location.pathname === "/engineer/me" ? "active" : "") + " d-flex gap-2 align-items-center text-dark"}
                    >
                        <div className="avatar_name fw-bold fs-6 link">
                            {username || "Profilo"}
                        </div>

                        <div className="avatar_wrapper d-flex">
                            <Image
                                src={userAvatar}
                                alt="Avatar"
                                className="avatar d-block pointer"
                                roundedCircle
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            />
                        </div>
                    </Nav.Link>

                    {/* Logout */}
                    <Nav.Link href="/login" className="logout ms-3 d-flex gap-2 align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                            strokeLinecap="round" strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" style={dangerColor}/>
                            <polyline points="16 17 21 12 16 7" style={dangerColor}/>
                            <line x1="21" y1="12" x2="9" y2="12" style={dangerColor}/>
                        </svg>

                        <span className="link" style={dangerColor}>Esci</span>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}
