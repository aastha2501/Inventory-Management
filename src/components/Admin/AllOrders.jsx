import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function AllOrders() {
    const token = JSON.parse(localStorage.getItem('token'));
    const [data, setData] = useState();
    useEffect(() => {
        axios
            .get("https://localhost:7270/api/Admin/allOrders", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then((response) => {
                setData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    return (
        <div>
             <div className='header'>
                <h5>All Orders</h5>
            </div>
            <div className="mt-3 table-resposive p-3">
                <table className='table table-bordered table-hover'>
                    <thead className='table-dark'>
                        <tr>
                            <th>User Id</th>
                            <th>Order Id</th>
                            <th>Quantity</th>
                            <th>Total Amount</th>
                            <th>Product Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && (
                                data.map((item, i) => {
                                    return <tr key={i}>
                                        <td>{item.userId}</td>
                                        <td>{item.orderId}</td>

                                        <td>{item.totalProducts}</td>
                                        <td>{item.totalPrice}</td>
                                        <td>

                                            {item.userOrderProductsRequestModels.map((product, j) => (
                                                <div>
                                                    <tr>
                                                        <td>
                                                            <b>Name:</b> {product.productName}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <b>Price:</b>{product.price}
                                                        </td>
                                                    </tr>
                                                </div>
                                            ))}

                                        </td>

                                    </tr>
                                })
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
