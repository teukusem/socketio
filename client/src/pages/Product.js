import { useContext, useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useDebounce } from 'use-debounce';
import { UserContext } from '../context/userContext';
import { useQuery } from 'react-query';

import Navbar from '../components/Navbar';
import ProductCard from '../components/card/ProductCard';

import imgEmpty from '../assets/empty.svg';
import { API } from '../config/api';

// API config

export default function Product() {
  const title = 'Shop';
  document.title = 'DumbMerch | ' + title;

  const [state] = useContext(UserContext);
  const [selectCategory, setSelectCategory] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [listCard, setListCard] = useState(1);
  const [value] = useDebounce(searchFilter, 1000);

  const loadMore = () => {
    setListCard(listCard + listCard);
  };

  // Fetching product data from database
  // let { data: products } = useQuery('productsCache', async () => {
  //   const response = await API.get('/products');
  //   return response.data.data;
  // });

  let { data: products } = useQuery('productsCache', async () => {
    const response = await API.get('/products');
    return response.data.data.slice(0, listCard);
  });

  const filterByWord = products?.filter((item) => {
    //if no input the return the original
    if (value === '') {
      return item;
    }
    //return the item which contains the user input
    else {
      return item.name?.toLowerCase().includes(value);
    }
  });

  const handleChangeSearch = (e) => {
    let lowerCase = e.target?.value.toLowerCase();
    setSearchFilter(lowerCase);
  };

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  return (
    <div>
      <Navbar title={title} />
      <Container className="mt-5">
        <Row>
          <Col className='d-flex'>
            <div className="text-header-product">Product</div>
            <div className="form ms-auto me-3">
              <input type="text" name="search" onChange={handleChangeSearch} placeholder="Search" style={{ width: '40vw' }} />
            </div>
          </Col>
        </Row>
        <Row className="my-4">
          {products?.length !== 0 ? (
            <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
              {filterByWord?.map((item, index) => (
                <ProductCard item={item} key={index} />
              ))}
            </Masonry>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <img src={imgEmpty} className="img-fluid" style={{ width: '40%' }} alt="empty" />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
        <Button onClick={() => loadMore()} variant="dark" className=" w-100">
          Load More
        </Button>
      </Container>
    </div>
  );
}
