import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function CartItems() {

    const [prodDetails, setProductDetails] = useState();
    const [products, setProducts] = useState();
    const [show, setShow] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const token = JSON.parse(localStorage.getItem('token'));

    const { userId } = useParams();
   // console.log(userId);
    const localStorageItems = localStorage.getItem("cartItems");
    const productItems = JSON.parse(localStorageItems);

 //   console.log(productItems);
    useEffect(() => {
        // get the items from the local storage
        const stored = localStorage.getItem("cartItems");
        if (stored) {
            const items = JSON.parse(stored);
            setProductDetails(items);
         //   console.log(items);
        }
        // get the products from the db
        axios
            .get("https://localhost:7270/dashboard", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then((response) => {
               // console.log(response.data);
                setProducts(response.data);
            }).catch((err) => {
                console.log(err);
            })

    }, [prodDetails]);

    
    const handleAdd = () => {
      
        setShow(true);
    }

    const getProductDetails = (id) => {
        const prod = products.find((p) => p.id == id);
        return prod;
    }

    const handleAddToInvoice = () => {

        const updatedProdDetails = prodDetails.map((prod) => {
            if (selectedProducts.includes(prod.id)) {
                // Increase the quantity of the matching product
                return {
                    ...prod,
                    quantity: prod.quantity + 1,
                };
            } else {
                return prod;
            }
        });

        const newSelectedProducts = selectedProducts.filter(
            (id) =>
                !prodDetails.some((prod) => prod.id === id)
        );
        const newProducts = newSelectedProducts.map((id) => {

            const newProduct = getProductDetails(id);

            // Set the initial quantity for the new product
            newProduct.quantity = 1;

            return newProduct;
        });

        // Combine the updatedProdDetails and newProducts arrays
        const mergedProdDetails = [...updatedProdDetails, ...newProducts];

        // Update prodDetails state
        setProductDetails(mergedProdDetails);

        // Update local storage
        localStorage.setItem("cartItems", JSON.stringify(mergedProdDetails));

        // Clear selected products
        setSelectedProducts([]);
        setShow(false);

        toast.success('Item added to cart');
    };

    //check that productId in the productDetails
    const handleChoose = (id) => {
     //   console.log(id);
        setSelectedProducts((prevSelectedProducts) => {
            if (prevSelectedProducts.includes(id)) {
                return prevSelectedProducts.filter((id) => id !== id);
            } else {
                return [...prevSelectedProducts, id];
            }
        });
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleRemove = (productId) => {
 
        const stored = localStorage.getItem("cartItems");
        const items = JSON.parse(stored);

        const updatedItems = items.map((item) => {
            if (item.id === productId) {
                const updatedQty = item.quantity - 1;
                if (updatedQty <= 0) {
                    return null;
                }

                return {
                    ...item,
                    quantity: updatedQty
                }
            }
            return item;
        })

        const filteredProd = updatedItems.filter((item) => item != null);

        //update the local storage
        setProductDetails(filteredProd);
        localStorage.setItem("cartItems", JSON.stringify(filteredProd));
    }

    const cal = () => {
        const stored = localStorage.getItem("cartItems");
        if (stored) {
            const items = JSON.parse(stored);
          //  console.log(items);

            // Calculate total quantity
            const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

            // Calculate subtotal
            const subtotal = items.reduce((accumulator, item) => accumulator + (item.quantity * item.price), 0);

            // Calculate GST on the subtotal
            const gstRate = 0.18; // Assuming a GST rate of 18%
            const gstAmount = Math.round(subtotal * gstRate);

            // Calculate grand total
            const grandTotal = Math.round(subtotal + gstAmount);
            return {
                totalQuantity,
                subtotal,
                gstAmount,
                grandTotal
            };
        }

        return {
            totalQuantity: 0,
            subtotal: 0,
            gstAmount: 0,
            grandTotal: 0
        };

    };

    const { totalQuantity, subtotal, gstAmount, grandTotal } = cal();
    var totalPrice = 0;

    if (productItems && Array.isArray(productItems)) {
        for (const item of productItems) {
            const itemPrice = item.price * item.quantity;
            totalPrice += itemPrice;
        }
    }

    let reqProd = [];
  
    for (var item in productItems) {
     // console.log(productItems[item].productId);
        let obj = {
            productId: productItems[item].id,
            price: productItems[item].price,
            quantity: productItems[item].quantity
        }
       // console.log(obj);
        reqProd.push(obj);
    }

    const handleSaveInvoice = () => {
        console.log(reqProd);
        const data = {
            requestProducts: reqProd,
            total: totalPrice
        };
       console.log(data);
       if(reqProd.length != 0) {
        axios
        .post("https://localhost:7270/api/Salesman/invoice", data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
           // console.log(response);
           localStorage.removeItem("cartItems");
            toast.success("Order Confirmed!!");
        }).catch((error) => {
            console.log(error);
        })

       } else {
        toast.error("No items in the cart to add");
       }
     
    }
  // console.log(products);
    return (
        <div>
            <div className='header'>
                <h5>Your order Details</h5>
            </div>
            <div className="mt-3 table-resposive p-3">
                <table className='table table-bordered table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>Item name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total price</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prodDetails ? (
                            prodDetails.map((prod) => (
                                <tr key={prod.productId}>
                                    <td>{prod.name}</td>
                                    <td>
                                        {/* <button onClick={() => handleAddProduct} className='btn btn-outline-dark'>-</button>
                                    {"   "} */}
                                        {prod.quantity}
                                        {/* {"   "}
                                    <button onClick={() => handleSubProduct} className='btn btn-outline-dark'>+</button> */}
                                    </td>
                                    <td>{prod.price}</td>
                                    <td>{prod.quantity * prod.price}</td>
                                    <td>
                                        <button className='btn btn-danger' onClick={() => handleRemove(prod.id)}>Remove</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No products</td>
                            </tr>
                        )}
                    </tbody>

                </table>
                <div style={{ float: "left" }}>
                    <button className='btn' style={{ backgroundColor: "tomato", color: "white" }} onClick={handleAdd}>Add Product</button>
                    <ToastContainer />
                </div>

                {
                    show && (
                        <Modal show={show}>
                            <Modal.Header>
                                <Modal.Title>Products</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <table className='table'>
                                    <thead>
                                        <tr>
                                            <th>Product name</th>
                                            <th>Price</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products ? (
                                            products.map((prod) => (
                                                <tr key={prod.id}>
                                                    <td>{prod.name}</td>
                                                    <td>{prod.price}</td>
                                                    <td>
                                                        <input type="checkbox"
                                                            checked={selectedProducts.includes(prod.id)}

                                                            onChange={() => handleChoose(prod.id)} />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3">No products</td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={handleAddToInvoice}>
                                    Add
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>

                            </Modal.Footer>
                        </Modal>
                    )
                }

                {/* invoice */}

                <div className='invoiceWrapper'>
                    <div className='invoice'>
                        <p><b>QUANTITY: </b> {totalQuantity}</p>
                        <p><b>SUBTOTAL:</b> {subtotal} <i className="fa-solid fa-indian-rupee-sign"></i></p>
                        <p><b>GST (18%): </b> {gstAmount} <i className="fa-solid fa-indian-rupee-sign"></i></p>
                        <p><b>GRAND TOTAL: </b> {grandTotal} <i className="fa-solid fa-indian-rupee-sign"></i></p>
                    </div>
                    <div className='text-center' style={{marginRight: "13rem"}}>
                        <button className='btn btn-success' onClick={handleSaveInvoice}>CheckOut</button>
                    </div>
                </div>


            </div>
        </div>
    )
}
