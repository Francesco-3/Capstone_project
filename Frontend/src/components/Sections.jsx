import { Card, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default function Sections() {
    return(
        <Row className="mt-3">
            <Nav>
                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/mechanical/section-a" className={classNames({ active: location.pathname === "/mechanical/section-a" })}>
                        <Card>
                            <Card.Body>Manutenzione Correttiva - Sezione A</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/mechanical/section-b" className={classNames({ active: location.pathname === "/mechanical/section-b" })}>
                        <Card>
                            <Card.Body>Manutenzione Preventiva - Sezione B</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/mechanical/section-c" className={classNames({ active: location.pathname === "/mechanical/section-c" })}>
                        <Card>
                            <Card.Body>Manutenzione Predittiva - Sezione C</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/mechanical/section-d" className={classNames({ active: location.pathname === "/mechanical/section-d" })}>
                        <Card>
                            <Card.Body>Manutenzione Migliorativa - Sezione D</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>
            </Nav>
        </Row>
    )
}