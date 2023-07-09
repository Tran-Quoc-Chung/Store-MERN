import React from "react";
import { Link, useLocation } from "react-router-dom";
import Marquee from "react-fast-marquee";
import BlogCard from "../components/BlogCard";
import ProductCard from "../components/ProductCard";
import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";
import ReactStars from "react-rating-stars-component";
//import { services } from "../utils/Data";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlog } from "../features/blogs/blogSlice";
import { getAllProducts } from "../features/product/productSlice";
import { useEffect } from "react";
import moment from "moment";
import { addToWishList } from "../features/product/productSlice";
import addcart from "../images/add-cart.svg";
import view from "../images/view.svg";
import watch2 from "../images/watch-1.avif";
import wish from "../images/wish.svg";

import prodcompare from "../images/prodcompare.svg";
import SliderImg from "../components/slider";
import { getCategory } from "../features/product/productSlice";
import { getUserCart } from "../features/user/userSlice";
import { useTranslation } from "react-i18next";


const Home = () => {
  const { t } = useTranslation();
  
  const dispatch = useDispatch();
  let location = useLocation();
  useEffect(() => {
    getBlogs();
    getProduct();
    getCategoryProduct();
    getCartInfo();
  }, [])
  const getBlogs = () => {
    dispatch(getAllBlog());
  }
  const getCartInfo = () => {
    dispatch(getUserCart())
  }
  const getCategoryProduct = () => {
    dispatch(getCategory());
  }
  const getProduct = () => {
    dispatch(getAllProducts());
  }
  const addToWishlist = (id) => {
    dispatch(addToWishList(id));
  }

  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);
  const categoryState = useSelector((state) => state.product.category);
 
  const getCategoryImage = (categoryId) => {
    switch (categoryId) {
      case 'Laptop':
        return '../images/laptop.jpg';
      case 'mobilephone':
        return '../images/mobile.jpg';
      case 'watch':
        return '../images/watch.webp';
      case 'AirPods':
        return '../images/headphone.jpg';
      default:
        return 'images/loading.gif';
    }
  };


  return (
    <>
      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{t("Top new product lauch")}</h3>
          </div>
        </div>
        <SliderImg />
      </Container>

      <Container class1="home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="categories d-flex justify-content-between flex-wrap align-items-center">

              {categoryState && categoryState.map((item, index) => {
                const categoryImg = getCategoryImage(item?._id)
                return (
                  <div className="d-flex gap align-items-center" key={index}>
                    <div>
                      <h6>{item._id}</h6>
                      <p>{t('Quantity')}: {item?.count}</p>
                    </div>
                    <img src={categoryImg} alt="../images/headphone.jpg" height={90}/>
                  </div>

                )
              })}


            </div>
          </div>
        </div>
      </Container>

      {/* Featured Collection */}
      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{t('Featured Collection')}</h3>
          </div>
          {
            productState && productState?.map((item, index) => {
              if (item.tags === "featured") {
                return (
                  <div
                    key={index} className="col-3" >
                    <Link to={`product/${item?._id}`}
                      className="product-card position-relative"

                    >
                      <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent" onClick={(e) => { addToWishlist(item._id) }}>
                          <img src={wish} alt="wishlist" />
                        </button>
                      </div>
                      <div className="product-image">
                        <img src={item.images[0]?.url ? item.images[0].url : "../images/loading.gif"} className="img-fluid d-block mx-auto" alt="product image" width={160} />
                        <img src={watch2} className="img-fluid" alt="product image" />
                      </div>
                      <div className="product-details">
                        <h6 className="brand">{item?.brand}</h6>
                        <h5 className="product-title">
                          {item?.title}
                        </h5>
                        <ReactStars
                          count={5}
                          size={24}
                          value={item?.totalrating.toString()}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        <p className="price">{item?.price}</p>
                      </div>
                      <div className="action-bar position-absolute">
                        <div className="d-flex flex-column gap-15">
                          <button className="border-0 bg-transparent">
                            <img src={prodcompare} alt="compare" />
                          </button>
                          <button className="border-0 bg-transparent">
                            <img src={view} alt="view" />
                          </button>
                          <button className="border-0 bg-transparent">
                            <img src={addcart} alt="addcart" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              }
            })
          }
        </div>
      </Container>

      {/* special product */}
      <Container class1="special-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{t('Special Products')}</h3>
          </div>
        </div>
        <div className="row">
          {
            productState && productState?.map((item, index) => {
              if (item.tags === "special") {
                return (
                  <SpecialProduct
                    key={index}
                    title={item?.title}
                    brand={item?.brand}
                    price={item?.price}
                    totalrating={item?.totalrating.toString()}
                    image={item?.images[0]?.url}
                    quantity={item?.quantity}
                    sold={item?.sold}
                  />
                )
              }
            })
          }

        </div>
      </Container>

      {/* Our Popular Products */}
      <Container class1="popular-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{t('Our Popular Products')}</h3>
          </div>
        </div>
        <div className="row">
          {
            productState && productState?.map((item, index) => {
              if (item.tags === "popular") {
                return (
                  <div
                    key={index} className="col-3" >
                    <Link to={`product/${item?._id}`}
                      className="product-card position-relative"

                    >
                      <div className="wishlist-icon position-absolute">
                        <button className="border-0 bg-transparent" onClick={(e) => { addToWishlist(item._id) }}>
                          <img src={wish} alt="wishlist" />
                        </button>
                      </div>
                      <div className="product-image">
                        <img src={item?.images[0] ? item?.images[0].url : "../images/loading.gif"} className="img-fluid d-block mx-auto" alt="product image" width={160} />
                        <img src={watch2} className="img-fluid" alt="product image" />
                      </div>
                      <div className="product-details">
                        <h6 className="brand">{item?.brand}</h6>
                        <h5 className="product-title">
                          {item?.title}
                        </h5>
                        <ReactStars
                          count={5}
                          size={24}
                          value={item?.totalrating.toString()}
                          edit={false}
                          activeColor="#ffd700"
                        />
                        <p className="price">{item?.price}</p>
                      </div>
                      <div className="action-bar position-absolute">
                        <div className="d-flex flex-column gap-15">
                          <button className="border-0 bg-transparent">
                            <img src={prodcompare} alt="compare" />
                          </button>
                          <button className="border-0 bg-transparent">
                            <img src={view} alt="view" />
                          </button>
                          <button className="border-0 bg-transparent">
                            <img src={addcart} alt="addcart" />
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              }
            })
          }

        </div>
      </Container>
      <Container class1="marque-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="marquee-inner-wrapper card-wrapper">
              <Marquee className="d-flex">
                <div className="mx-4 w-25">
                  <img src="images/brand-01.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-02.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-03.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-04.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-05.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-06.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-07.png" alt="brand" />
                </div>
                <div className="mx-4 w-25">
                  <img src="images/brand-08.png" alt="brand" />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </Container>
      {/* Blog */}
      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <h3 className="section-heading">{t('Our Latest Blogs')}</h3>
          </div>
        </div>
        <div className="row">
          {blogState &&
            blogState?.map((item, index) => {
              if (index < 4) {
                return (
                  <div className=" col-3">
                    <BlogCard id={item?._id} title={item?.title} description={item?.description} image={item?.images[0].url} date={moment(item?.createdAt).format('MMMM Do YYYY, h:mm a')} />
                  </div>
                )
              }

            })
          }
        </div>
      </Container>
    </>
  );
};

export default Home;
