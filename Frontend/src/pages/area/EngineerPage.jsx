import "bootstrap/dist/css/bootstrap.min.css"
import AsideLeft from "../../components/AsideLeft"
import "../../App.css";
import { Container, Row, Col } from "react-bootstrap"
import { Outlet } from "react-router-dom"

export default function EngineerPage() {
  return (
    <Container fluid className="p-0 vh-100 d-flex m-0">
      <Row className="mx-0 p-3 w-100 h-100">
        <Col xs={12} sm={1} md={1} lg={3} xl={2} xxl={2} className="p-0 d-flex">
          <AsideLeft />
        </Col>

        <Col xs={12} sm={11} md={11} lg={9} xl={10} xxl={10} className="p-2 h-100 overflow-auto">
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}