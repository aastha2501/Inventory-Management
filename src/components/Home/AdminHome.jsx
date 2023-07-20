import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AdminHome() {

  const [show, SetShow] = useState(false);
  const [showPopup, SetShowPopup] = useState(false);

  const [prodId, setProdId] = useState();
  const [showEdit, setShowEdit] = useState(false);

  const [productDetails, setProductDetails] = useState('');


  const token = JSON.parse(localStorage.getItem('token'));

  const handleBtn = () => {
    SetShow(true);
  }
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    axios
      .get("https://localhost:7270/dashboard", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((response) => {
    //  console.log(response.data);
        setData(response.data);
        //  setQuantity(response.data.quantity);
      }).catch((err) => {
        console.log(err);
      })
  }, [data]);

  const handleClose = () => {
    SetShow(false);
    setShowEdit(false);
  }

  const handleDelete = (id) => {
   // console.log(id);
    setProdId(id);
    SetShowPopup(true);
  }

  const handleDeleteClose = () => {
    SetShowPopup(false);
  }

  const handleSuccess = () => {
    axios
      .delete("https://localhost:7270/api/Admin/delete/" + prodId, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      })
      .then((response) => {
       // console.log(response);
        SetShowPopup(false);
      }).catch((error) => {
        console.log(error);
      })
    console.log(prodId);
  }
  const validate = values => {
    let errors = {}
    if (!values.name) {
      errors.name = 'Required'
    } else if (!values.desc) {
      errors.desc = 'Required'
    } else if (!values.quantity) {
      errors.quantity = 'Required'
    } else if (!values.price) {
      errors.price = 'Required'
    }

    return errors;
  }
  // "Accept": "multipart/form-data",
  const formik = useFormik({
    initialValues: {
      name: "",
      desc: "",
      price: "",
      quantity: "",
      image: ""
    },
    onSubmit: (values, { resetForm }) => {
   //   debugger;
      console.log(values);
      console.log(values.name);
      console.log(values.image);

      const formData = new FormData();
      formData.append('Name', values.name);
      formData.append('Description', values.desc);
      formData.append('Quantity', values.quantity);
      formData.append('Price', values.price);
      formData.append('Image', values.image);
      formData.append('ImagePath', '');
    
      //axios call
      axios
        .post("https://localhost:7270/api/Admin/addproduct", formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        })
        .then((response) => {
         // console.log(response);
          SetShow(false);

        }).catch((error) => {
          console.log(error);
        })

      resetForm();
    },
    validate
  });

  const EditProduct = (productId) => {
    console.log(productId);
    setProdId(productId);

    if (productId != null) {
      axios
        .get("https://localhost:7270/api/Salesman/prod/" + productId, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then((response) => {
         // console.log(response);
          setProductDetails(response.data);
        }).catch((error) => {
          console.log(error);
        })


    }
    setShowEdit(true);

  }

  const handleEdit = (e) => {
    e.preventDefault();

    const updatedQty = quantity;
    const data = {

      quantity: updatedQty
    }

    axios
      .post("https://localhost:7270/api/Admin/edit/" + prodId, data, {
        headers: {
          "Authorization": `Bearer ${token}`,

        },
      })
      .then((response) => {
        console.log(response);
        setShowEdit(false);
      }).catch((error) => {
        console.log(error);
      })
  }

  return (

    <div style={{ marginTop: "1rem", padding: "2rem" }}>
      <div className="text-center">
        <button className='btn btn-primary' onClick={handleBtn}>Add Product</button>
      </div>
      <div className="mt-3 table-resposive p-3">
        <table className='table table-bordered table-hover'>
          <thead className='table-dark'>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Image</th>
              <th scope="col">Description</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {
              data && (
                data.map((item, i) => {
                  return <tr key={i}>
                    <td>{item.name}</td>
                    <td>
                      <img src={item.imageUrl} style={{height: "120px", width: "120px"}} alt="image"/>  
                    </td> 
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>
                      <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                      {" "} <button className="btn btn-info" onClick={() => EditProduct(item.id)}>Edit</button>
                    </td>
                  </tr>
                })
              )
            }

          </tbody>
        </table>
      </div>
      {
        // add product popup
        show && (
          <Modal show={show}>
            <Modal.Header>
              <Modal.Title>Add Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Product name</label>
                  <input type="text" name="name" id="name" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                  {formik.touched.name && formik.errors.name ? <div className='form-error'>{formik.errors.name}</div> : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="desc" className="form-label">Product description</label>
                  <input type="text" name="desc" id="desc" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.desc} />
                  {formik.touched.desc && formik.errors.desc ? <div className='form-error'>{formik.errors.desc}</div> : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <input type="number" name="quantity" id="quantity" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.quantity} />
                  {formik.touched.quantity && formik.errors.quantity ? <div className='form-error'>{formik.errors.quantity}</div> : null}
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input type="number" step="0.01" name="price" id="price" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.price} />
                  {formik.touched.price && formik.errors.price ? <div className='form-error'>{formik.errors.price}</div> : null}
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image</label>
                  <input type="file" name="image" id="image" className="form-control" onChange={(e) => formik.setFieldValue("image", e.currentTarget.files[0])} onBlur={formik.handleBlur} />
                  {formik.touched.image && formik.errors.image ? <div className='form-error'>{formik.errors.image}</div> : null}
                </div>
                {/* onChange={(event) => {
                    setFieldValue("file", event.currentTarget.files[0]);
                  }} */}
                <div className='mb-3 text-center'>
                  <button className='btn btn-primary' type='submit'>Add</button>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>

            </Modal.Footer>
          </Modal>
        )
      }

      {
        // delete product pop up
        showPopup && (
          <Modal show={showPopup}>
            <Modal.Header>
              <Modal.Title>Delete Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>are you sure you want to delete?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={() => handleSuccess(prodId)}>
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
{/* edit */}
      {
      showEdit && (
        <Modal show={showEdit}>
        <Modal.Header>
          <Modal.Title>Edit Product Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b>Product Name: </b>{productDetails.name}</p>
          <form onSubmit={handleEdit}>
            <div className="mb-3">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input type="number" name="quantity" id="quantity" className="form-control" onChange={e => setQuantity(e.target.value)} value={quantity} />
            </div>
            <div className='mb-3 text-center'>
              <button className='btn btn-primary' type='submit'>Edit</button>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>
      )
      }
    </div>
  )
}
