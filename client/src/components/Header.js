import { React, useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import compare from "../images/compare.svg";
import wishlist from "../images/wishlist.svg";
import user from "../images/user.svg";
import cart from "../images/cart.svg";
import menu from "../images/menu.svg";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../features/language/languageSlice";
import { useTranslation } from 'react-i18next';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { getSingleProduct } from "../features/product/productSlice";
import { getUserCart } from "../features/user/userSlice";

const Header = () => {

  const dispatch = useDispatch();
  const [totalCart, setTotalCart] = useState(null);
  const [quantityProduct, setQuantityProduct] = useState(null);
  const userCartState = useSelector((state) => state.auth.userCart);
  const userState = useSelector(state => state.auth);
  const { t, i18n } = useTranslation();
  const [paginate, setPaginate] = useState(true);
  const productsState = useSelector(state => state?.product.product)
  const [productOtp, setproductOtp] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    let data = []
    for (let index = 0; index < productsState.length; index++) {
      const element = productsState[index]
      data.push({ id: index, prod: element?._id, name: element?.title })
    }
    setproductOtp(data)
  }, [productsState])

  useEffect(() => {
    dispatch(getUserCart());
  },[])
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < userCartState?.length; i++) {

      sum = sum + (userCartState[i]?.price * (userCartState[i]?.quantity));
      setTotalCart(sum);
      setQuantityProduct(i + 1);
    }
    if (userCartState?.length === 0) {
      setTotalCart(0);
      setQuantityProduct(0)
    }
  }, [userCartState])

  const handleLanguageChange = (newLanguage) => {
    dispatch(setLanguage(newLanguage));
    i18n.changeLanguage(newLanguage);
  };
  const language = useSelector(state => state.language)
  return (
    <>
      <header className="header-top-strip py-3" >
        <div className="container-xxl" style={{ height: "16px" }}>
          <div className="row">
            <div className="col-6">
              <p className="text-white mb-0">
                {t('Hello')} {userState && userState?.user?.firstName}! {t('Thanks for visiting our website')}.
              </p>
            </div>
            <div style={{ width: "500px", color: "white", display: "flex", justifyContent: "flex-end", marginLeft: "auto" }}>
              <p style={{ width: "100px", color: "white" }}>
                {t('language')}
              </p>
              <select
                name=""
                defaultValue={{ language }}
                className="form-control form-select"
                style={{ width: "141px", backgroundColor: "transparent", color: "white", marginTop: "-5px", height: "34px" }}
                onChange={(e) => handleLanguageChange(e.target.value)}

              >
                <option value="en" style={{ color: "black" }}>English</option>
                <option value="vi">Vietnamese</option>
              </select>
            </div>
          </div>


        </div>
      </header>
      <header className="header-upper py-3">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-2">
              <h3>
                <Link className="text-white">DEV STORE </Link>
              </h3>
            </div>
            <div className="col-5">
              <div className="input-group">
                <Typeahead
                  id="pagination-example"
                  onPaginate={() => console.log('Results paginated')}
                  options={productOtp}
                  onChange={(selected) => {
                    navigate(`/product/${selected[0]?.prod}`)
                    dispatch(getSingleProduct(selected[0].prod))
                  }}
                  minLength={2}
                  paginate={paginate}
                  labelKey={"name"}
                  placeholder="Search for product here..."
                />
                <span className="input-group-text p-3" id="basic-addon2">
                  <BsSearch className="fs-6" />
                </span>
              </div>
            </div>
            <div className="col-5">
              <div className="header-upper-links d-flex align-items-center justify-content-between">
                <div>
                  <Link
                    to="/compare-product"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={compare} alt="compare" />
                    <p className="mb-0">
                      {t('Compare')} <br /> {t('Products')}
                    </p>
                  </Link>
                </div>
                <div>
                  <Link
                    to="/wishlist"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={wishlist} alt="wishlist" />
                    <p className="mb-0">
                      {t('Favourite')} <br /> {t('wishlist')}
                    </p>
                  </Link>
                </div>
                <div>
                  <Link
                    to={userState.user === null ? "/login" : "/"}
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={user} alt="user" />
                    {
                      useState?.user === ""
                        ?
                        <p className="mb-0">
                          {t('Log in')} <br /> {t('My Account')}
                        </p>
                        :
                        <p className="mb-0">
                          {t('Welcome')} <br /> {userState.user ? userState.user.firstName : "Login here"}
                        </p>
                    }

                  </Link>
                </div>
                <div>
                  <Link
                    to="/cart"
                    className="d-flex align-items-center gap-10 text-white"
                  >
                    <img src={cart} alt="cart" />
                    <div className="d-flex flex-column gap-10">
                      <span className="badge bg-white text-dark">{quantityProduct ? quantityProduct : "0"}</span>
                      <p className="mb-0">{totalCart ? totalCart : "0"}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className="header-bottom py-3">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <div className="menu-bottom d-flex align-items-center gap-30">
                <div>
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle bg-transparent border-0 gap-15 d-flex align-items-center"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={menu} alt="" />
                      <span className="me-5 d-inline-block">
                        Shop Categories
                      </span>
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Another action
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item text-white" to="">
                          Something else here
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="menu-links">
                  <div className="d-flex align-items-center gap-15">
                    <NavLink to="/">{t('Home')}</NavLink>
                    <NavLink to="/product">{t('Our Store')}</NavLink>
                    <NavLink to="/blogs">{t('Blogs')}</NavLink>
                    <NavLink to="/contact">{t("Contact")}</NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
