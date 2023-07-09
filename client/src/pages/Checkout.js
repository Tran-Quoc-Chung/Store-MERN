import {React,useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik,Formik } from "formik";
import * as yup from "yup";
import { createOrderUser } from "../features/user/userSlice";

const orderSchema = yup.object({
  firstName: yup.string().required("FirstName is required"),
  lastName: yup.string().required("LastName is required"),
  address: yup.string().required("Address is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  pincode: yup.string().required("Pincode is required"),
  other: yup.string().nullable(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const [totalCart, setTotalCart] = useState(null);
  const userCartState = useSelector((state) => state.auth.userCart);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < userCartState?.length; i++) {
      sum = sum + (userCartState[i]?.price * (userCartState[i]?.quantity));
      setTotalCart(sum);
    }
  }, [userCartState]);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName:'',
      address: '',
      state: '',
      city: '',
      country: '',
      pincode: '',
      other:''
    },
    validationSchema:orderSchema,
    onSubmit: values => {
      console.log("values:", values);
    }
  });

  return (
    <>
      <Container class1="checkout-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-7">
            <div className="checkout-left-data">
              <h3 className="website-name">Dev Corner</h3>
              <nav
                style={{ "--bs-breadcrumb-divider": ">" }}
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link className="text-dark total-price" to="/cart">
                      Cart
                    </Link>
                  </li>
                  &nbsp; /&nbsp;
                  <li
                    className="breadcrumb-ite total-price active"
                    aria-current="page"
                  >
                    Information
                  </li>
                  &nbsp; /
                  <li className="breadcrumb-item total-price active">
                    Shipping
                  </li>
                  &nbsp; /
                  <li
                    className="breadcrumb-item total-price active"
                    aria-current="page"
                  >
                    Payment
                  </li>
                </ol>
              </nav>
              
              <h4 className="mb-3">Shipping Address</h4>
              <form action="" className="d-flex gap-15 flex-wrap justify-content-between" onSubmit={formik.handleSubmit} >
                <div className="w-100">
                  <select name="country" className="form-control form-select" id="" value={formik.values.country} onChange={formik.handleChange("country")} onBlur={formik.handleBlur("country")}>
                    <option value="" selected >
                      Select Country
                    </option>
                    <option value="Việt Nam" selected >
                      Việt Nam
                    </option>
                  </select>
                  <div className="error">{ formik.touched.country && formik.errors.country}</div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form-control"
                    value={formik.values.firstName}
                    onChange={formik.handleChange("firstName")}
                    onBlur={formik.handleBlur("firstName")}
                  />
                  <div className="error">{ formik.touched.firstName && formik.errors.firstName}</div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form-control"value={formik.values.lastName}
                    onChange={formik.handleChange("lastName")}
                    onBlur={formik.handleBlur("lastName")}
                  />
                  <div className="error">{ formik.touched.lastName && formik.errors.lastName}</div>
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="form-control"
                    value={formik.values.address}
                    onChange={formik.handleChange("address")}
                    onBlur={formik.handleBlur("address")}
                  />
                  <div className="error">{ formik.touched.address && formik.errors.address}</div>
                </div>
                <div className="w-100">
                  <input
                    type="text"
                    name="other"
                    placeholder="Apartment, Suite ,etc"
                    className="form-control"
                    value={formik.values.order}
                    onChange={formik.handleChange("order")}
                    onBlur={formik.handleBlur("order")}
                  />
                  <div className="error">{ formik.touched.order && formik.errors.order}</div>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form-control" 

                    value={formik.values.city}
                    onChange={formik.handleChange("city")}
                    onBlur={formik.handleBlur("city")}
                  />
                  <div className="error">{ formik.touched.city && formik.errors.city}</div>
                </div>
                <div className="flex-grow-1">
                  <select name="state" className="form-control form-select" id="">
                    <option value="" selected disabled>
                      Select State
                    </option>
                    <option value="Ordered" selected disabled>
                      Ordered
                    </option>
                  </select>
                </div>
                <div className="flex-grow-1">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Zipcode"
                    className="form-control"
                    value={formik.values.pincode}
                    onChange={formik.handleChange("pincode")}
                    onBlur={formik.handleBlur("pincode")}
                  />
                  <div className="error">{ formik.touched.pincode && formik.errors.pincode}</div>
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-dark">
                      <BiArrowBack className="me-2" />
                      Return to Cart
                    </Link>
                    <Link to="/cart" className="button">
                      Continue to Shipping
                    </Link>
                   <button className="button" type="submit" >Buy now</button>
                  </div>
                </div>
                
              </form>
            </div>
          </div>
          <div className="col-5">
            <div className="border-bottom py-4">
              {
                userCartState && userCartState?.map((item, index) => {
                  return (
                    <div className="d-flex gap-10 mb-2 align-align-items-center">
                      <div className="w-75 d-flex gap-10">
                        <div className="w-25 position-relative">
                          <span
                            style={{ top: "-10px", right: "2px" }}
                            className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                          >
                            {item?.quantity}
                          </span>
                          <img className="img-fluid" src={item.productId.images ? item?.productId.images[0].url : "../images/loading.gif" } alt="product" />
                        </div>
                        <div>
                          <h5 className="total-price">{item?.productId.title}</h5>
                          <p className="total-price">{item?.color.title}</p>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="total">{item?.price } VND</h5>
                      </div>
                    </div>
                  )
                })
               
              }


            </div>
            <div className="border-bottom py-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="total">Subtotal</p>
                <p className="total-price">{totalCart ? totalCart : "0" } VND</p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 total">Shipping</p>
                <p className="mb-0 total-price">{totalCart ? 30000 : "0" } VND</p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center border-bootom py-4">
              <h4 className="total">Total</h4>
              <h5 className="total-price">{totalCart ? totalCart + 30000  : "0"}</h5>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Checkout;
