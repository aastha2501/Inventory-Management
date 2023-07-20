import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Invoices() {

  const { userId } = useParams();
  const [data, setData] = useState();
  const [show, setShow] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    fetchData();
  }, [data])

  const fetchData = () => {
    axios
      .get("https://localhost:7270/api/Salesman/invoices/" + userId, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }
  const handleCancleInvoice = (id) => {
    // console.log(id);
    setInvoiceId(id);
    setShow(true);
  }

  const handleDeleteClose = () => {
    setShow(false);
  }

  const handleSuccess = () => {
    axios
      .delete("https://localhost:7270/api/Salesman/deleteInvoice/" + invoiceId,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
      .then((response) => {
        console.log(response);
        setShow(false);
      }).catch((error) => {
        console.log(error);
      })
  }

  return (
    <div>
      <div className='header'>
        <h5>Your orders</h5>
      </div>
      <div className="mt-3 table-resposive p-3">
        <table className='table table-bordered table-hover'>
          <thead className='table-dark'>
            <tr>
              <th>Order Id</th>
              <th>Quantity</th>
              <th>Total Amount</th>
              <th>Product Details</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data && data.length ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{item.orderId}</td>
                  <td>{item.totalProducts}</td>
                  <td>{item.totalPrice}</td>
                  <td>
                    {item.userOrderProductsRequestModels.map((product, j) => (
                      <div key={j}>
                        <tr>
                          <td>
                            <b>Name:</b> {product.productName}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>Price:</b> {product.price}
                          </td>
                        </tr>
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleCancleInvoice(item.orderId)}>Cancel</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No previous orders</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      {
        // delete product pop up
        show && (
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>Cancle Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to cancle?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => handleSuccess(invoiceId)}>
                Yes
              </Button>
              <Button variant="primary" onClick={handleDeleteClose}>
                No
              </Button>

              <Button variant="secondary" onClick={handleDeleteClose}>
                Close
              </Button>

            </Modal.Footer>
          </Modal>
        )
      }
    </div>
  )
}
