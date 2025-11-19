import "bootstrap/dist/css/bootstrap.min.css"
import "../../App.css"
import { Container, Row, Col, Card, Form, Alert } from "react-bootstrap"

export default function DashboardPage() {
  return (
    <Container fluid className="d-flex align-items-center" style={{ paddingTop: 56 }}>
        <Row className="w-100 justify-content-center">
            <Col xs={11} sm={10} md={8} lg={5} xl={4}>
                <Card className="shadow-lg rounded border">
                    <Card.Body className="p-4"></Card.Body>
                        <h4 className="mb-3">Mechanical Area</h4>
                        <p>Welcome to your mechanical area!</p>
                        <button onClick={"/login"}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-150 ease-in-out"
                        >Logout</button>
                </Card>
            </Col>
        </Row>
    </Container>
  )
}