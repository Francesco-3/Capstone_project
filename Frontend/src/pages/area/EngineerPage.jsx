import "bootstrap/dist/css/bootstrap.min.css"
import "../../App.css"
import AsideLeft from "../../components/AsideLeft"
import { Container, Row, Col, Card } from "react-bootstrap"
import { Outlet } from "react-router-dom"

export default function EngineerPage() {
  return (
    <Container fluid className="d-flex">
      <Row className="flex-grow-1 mx-0 p-3 vh-100">
        {/* 1. Colonna per la Sidebar (AsideLeft) */}
        {/* md={3} o md={2} definisce la larghezza della sidebar sulla griglia Bootstrap */}
        <Col xs={12} md={3} lg={4} className="p-0 d-flex">
          <AsideLeft /> {/* <--- CHIAMATA DEL COMPONENTE */}
        </Col>
            
        {/* 2. Colonna per il Contenuto Principale */}
        <Col xs={12} md={9} lg={8} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}