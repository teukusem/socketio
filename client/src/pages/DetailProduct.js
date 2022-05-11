import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import convertRupiah from 'rupiah-format';
import { useQuery, useMutation } from 'react-query';

import Navbar from '../components/Navbar';

import dataProduct from '../fakeData/product';

import { API } from '../config/api';

export default function DetailProduct() {
  let navigate = useNavigate();
  let { id } = useParams();

  let { data: product } = useQuery('productCache', async () => {
    const response = await API.get('/product/' + id);
    return response.data.data;
  });

  const handleBuy = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        price: product.price,
      };

      const body = JSON.stringify(data);

      const response = await API.post('/transaction', body, config);

      const token = response.data.payment.token;

      window.snap.pay(token, {
        onSuccess: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate('/profile');
        },
        onPending: function (result) {
          /* You may add your own implementation here */
          console.log(result);
          navigate('/profile');
        },
        onError: function (result) {
          /* You may add your own implementation here */
          console.log(result);
        },
        onClose: function () {
          /* You may add your own implementation here */
          alert('you closed the popup without finishing the payment');
        },
      });

      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    //change this to the script source you want to load, for example this is snap.js sandbox env
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    //change this according to your client-key
    const myMidtransClientKey = 'Client key here ...';

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransScriptUrl;
    // optional if you want to set script attribute
    // for example snap.js have data-client-key attribute
    scriptTag.setAttribute('data-client-key', myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  // Insert transaction data

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col md="2"></Col>
          <Col md="3">
            <img src={product?.image} className="img-fluid" />
          </Col>
          <Col md="5">
            <div className="text-header-product-detail">{product?.name}</div>
            <div className="text-content-product-detail">Stock : {product?.qty}</div>
            <p className="text-content-product-detail mt-4">{product?.desc}</p>
            <div className="text-price-product-detail text-end mt-4">{convertRupiah.convert(product?.price)}</div>
            <div className="d-grid gap-2 mt-5">
              <button onClick={(e) => handleBuy.mutate(e)} className="btn btn-buy">
                Buy
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
