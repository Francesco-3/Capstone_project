import { Card, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default function EngineerSections() {
    return(
        <Row className="mt-3">
            <Nav>
                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/engineer/warehouse/section-a" className={classNames({ active: location.pathname === "/engineer/warehouse/section-a" })}>
                        <Card>
                            <Card.Body>Manutenzione Correttiva - Sezione A</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/engineer/warehouse/section-b" className={classNames({ active: location.pathname === "/engineer/warehouse/section-b" })}>
                        <Card>
                            <Card.Body>Manutenzione Preventiva - Sezione B</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/engineer/warehouse/section-c" className={classNames({ active: location.pathname === "/engineer/warehouse/section-c" })}>
                        <Card>
                            <Card.Body>Manutenzione Predittiva - Sezione C</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>

                <Col xs={12} sm={6} md={3} className="mb-3">
                    <Nav.Link as={Link} to="/engineer/warehouse/section-d" className={classNames({ active: location.pathname === "/engineer/warehouse/section-d" })}>
                        <Card>
                            <Card.Body>Manutenzione Migliorativa - Sezione D</Card.Body>
                        </Card>
                    </Nav.Link>
                </Col>
            </Nav>
        </Row>
    )
}