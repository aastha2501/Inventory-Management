import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router-dom';
import jwt from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UserHome() {

  const navigate = useNavigate();
  const [userId, setUserId] = useState();

  const [data, setData] = useState();

  const token = JSON.parse(localStorage.getItem('token'));
 
  useEffect(() => {
    axios
      .get("https://localhost:7270/dashboard", {headers: {
        "Authorization": `Bearer ${token}`,
    }})
      .then((response) => {
      //  const token = JSON.parse(localStorage.getItem("token"));
        if (token) {
      
          const claims = jwt(token);
       
          const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
          setUserId(userId);
        }
        //console.log(response.data);
        setData(response.data);
      }).catch((err) => {
        console.log(err);
      })
  }, [data]);

  const handleToast = () => {
    console.log("===");
    toast.success('Item added to cart');
  };

  const handleAdd = (id) => {
    console.log(id);

    axios
      .get("https://localhost:7270/api/Salesman/prod/" + id, { headers: {
        "Authorization": `Bearer ${token}`,
      },})
      .then((response) => {
        console.log(response.data);
        console.log(response.data.id);

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItem = cartItems.find(item => item.id === response.data.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          const newItem = {
            id: response.data.id,
            name: response.data.name,
            price: response.data.price,
            quantity: 1,
          };
          cartItems.push(newItem);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        handleToast();
      }).catch((error) => {
        console.log(error);
      })

  }


  return (
    <div className='container'>
    
      <div class="row p-4">
        {
          data && (
            data.map((item, i) => {
              return <div key={i} className="col-md-3 mb-1">
                <div className="card">
                  <div className="card-body bg-light">
                    <h5 className="card-title">{item.name}</h5>
                    <img src={item.imageUrl}/>
                    <p className="card-text">
                      <p><b>Description:</b> {item.description}</p>
                      <h5 className="mb-0 font-weight-semibold"><b>Price: </b>{item.price}</h5>
                    </p>
                    <div style={{ float: "right" }}>
                      <a href="#" style={{color:"white", backgroundColor: "tomato"}} className="btn btn-sm" onClick={() => handleAdd(item.id)}><i class="fa fa-cart-plus mr-2"></i> Add to Cart</a>
                      <ToastContainer />
                    </div>
                  </div>
                </div>
              </div>

            })
          )
        }

      </div>
    
    </div>
  )
}
