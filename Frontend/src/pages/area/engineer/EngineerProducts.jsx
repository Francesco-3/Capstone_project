//import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, } from 'react-bootstrap'
import '../../../components/css/Products.css'

export default function EngineerProducts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAllProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/products/products", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_code, product_name, weight, measurement, stock, price, insertion_date }),
      })
    } catch() {}
  }

  return (
    <Row>
      <Col>
        <Card>
          <Card.Body>
            <Form>
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Product Name...'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col>Aggiungi prodotti</Col>
    </Row>
  )
}