import Navbar from "../../components/Navbar"
import Sections from '../../components/Sections'
import { Container, Row, Col } from 'react-bootstrap'
import { Outlet } from "react-router-dom"

export default function MechanicalPage() {
  return (
        <Container fluid className="p-0 vh-100 d-flex m-0">
            <Row className="mx-0 p-3 w-100 h-100">
                <Col xs={11} sm={10} md={6} lg={8} xl={10} xxl={12} className="p-0 d-flex flex-column">
                    <Navbar />

                    <Sections />

                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}