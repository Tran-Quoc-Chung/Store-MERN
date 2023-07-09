import React, { useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Color from "../components/Color";
import Meta from "../components/Meta";
import watch from "../images/watch.jpg";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getProductCompare,deleteFromCompare } from "../features/compare/compareSlice";

const CompareProduct = () => {
  const dispatch = useDispatch();
  const getProduct = () => {
    dispatch(getProductCompare())
  }
  const compareState = useSelector(state => state.compare.detailProduct);

  useEffect(() => {
    getProduct();
  }, [])

  const deleteProduct = (productId) => {
    dispatch(deleteFromCompare(productId))
  }

  return (
    <>
      <Meta title={"Compare Products"} />
      <BreadCrumb title="Compare Products" />
      <Container class1="compare-product-wrapper py-5 home-wrapper-2">
        <div className="row">
          {
            compareState && compareState.length > 0
              ?
              (compareState?.map((item, index) => {
                return (
                  <div className="col-3">
            <div className="compare-product-card position-relative">
              <img
                src="../images/del.svg"
                alt="cross"
                className="position-absolute cross img-fluid"
                onClick={()=>(deleteProduct(item?._id))}        
              />
              <div className="product-card-image">
                <img src={item.images[0].url} alt="watch" height={130} style={{alignItems:"center",justifyContent:"center",marginTop:"10px",marginLeft:"20px"}} />
              </div>
              <div className="compare-product-details">
                <h5 className="title">
                {item.title}
                </h5>
                        <h6 className="price mb-3 mt-3">{item.price } VND </h6>

                <div>
                  <div className="product-detail">
                    <h5>Brand:</h5>
                    <p>{item.brand}</p>
                  </div>
                  <div className="product-detail">
                    <h5>Type:</h5>
                    <p>{item.category}</p>
                  </div>
                  <div className="product-detail">
                    <h5>Availablity:</h5>
                    <p>In Stock</p>
                  </div>
                  <div className="product-detail">
                    <h5>Color:</h5>
                    <Color />
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
                )
              }))
                :
              (
                <h1>No data</h1>
              )

          }

        </div>
      </Container>
    </>
  );
};

export default CompareProduct;
