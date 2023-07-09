import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import watch from "../images/watch.jpg";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserCart } from "../features/user/userSlice";
import { deleteProductCart, updateProductCart } from "../features/user/userSlice";

const Cart = () => {
  const [quantity, setQuantity] = useState(null);
  const [totalCart,setTotalCart]=useState(null)
  const dispatch = useDispatch();

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (quantity !== null) {
      handleUpdateQuantity()
    }
  }, [quantity])
  const handleUpdateQuantity = () => {
    quantity && dispatch(updateProductCart({ cartId: quantity.cartId, quantity: quantity.quantityProd }));
    setTimeout(() => {
      dispatch(getUserCart)
    }, 200);
  }

  const getCart = () => {
    dispatch(getUserCart())
  }

  const handleDeleteFromCart = (id) => {
    dispatch(deleteProductCart(id));
  }

  const cartData = useSelector((state) => state.auth.userCart);
  const userCartState = useSelector((state) => state.auth.userCart);



  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < userCartState?.length; i++){
      sum = sum + ( userCartState[i]?.price *  ( userCartState[i]?.quantity )) ;
      setTotalCart(sum);
    }
    if (userCartState?.length === 0) {
      setTotalCart(0);
      setQuantity(0);
    }
  },[userCartState])



  return (
    <>
      <Meta title={"Cart"} />
      <BreadCrumb title="Cart" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="cart-header py-3 d-flex justify-content-between align-items-center">
              <h4 className="cart-col-1">Product</h4>
              <h4 className="cart-col-2">Price</h4>
              <h4 className="cart-col-3">Quantity</h4>
              <h4 className="cart-col-4">Total</h4>
            </div>

            {
              cartData &&
              cartData?.map((item, index) => {
                return (
                  <div className="cart-data py-3 mb-2 d-flex justify-content-between align-items-center">
                    <div className="cart-col-1 gap-15 d-flex align-items-center">
                      <div className="w-25">
                        <img src={item?.productId?.images[0].url} className="img-fluid" alt="product image" />
                      </div>
                      <div className="w-75">
                        <p>{item?.productId.title}</p>
                        <p>Color: {item?.color.title}</p>
                      </div>
                    </div>
                    <div className="cart-col-2">
                      <h5 className="price">{item?.productId.price} VND</h5>
                    </div>
                    <div className="cart-col-3 d-flex align-items-center gap-15">
                      <div>
                        <input
                          className="form-control"
                          type="number"
                          name=""
                          min={1}
                          max={10}
                          id=""
                          value={quantity ? quantity.quantityProd : item?.quantity}
                          onChange={(e) => setQuantity({ cartId: item._id, quantityProd: e.target.value })}
                        />
                      </div>
                      <div>
                        <AiFillDelete className="text-danger" onClick={() => handleDeleteFromCart(item?._id)} />
                      </div>
                    </div>
                    <div className="cart-col-4">
                      <h5 className="price"> {item.quantity * item?.productId.price} VND</h5>
                    </div>
                  </div>
                )
              })
            }


          </div>
          <div className="col-12 py-2 mt-4">
            <div className="d-flex justify-content-between align-items-baseline">
              <Link to="/product" className="button">
                Continue To Shopping
              </Link>
              <div className="d-flex flex-column align-items-end">
                <h4>SubTotal: {totalCart ? totalCart : "0" } VND</h4>
                <p>Taxes and shipping calculated at checkout</p>
                <Link to="/checkout" className="button">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Cart;
