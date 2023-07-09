import { useEffect, useState, React } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useDispatch, useSelector } from "react-redux"; 
import "./slider.css"
import { getNewProduct } from "../features/product/productSlice";
import { Link, useNavigate } from "react-router-dom";


const SliderImg = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay:true
      };
    useEffect(() => {
        getProduct()
    }, []);

    const getProduct = () => {
        dispatch(getNewProduct());
    }

    const newProductState= useSelector(state=>state.product.newProduct)
    const singleProduct = (id) => {
        console.log(id)
        navigate(`/product/${id}`)
    }
    
    return ( newProductState &&
        <div className="slider">
            <Slider {...settings}>
            {newProductState?.map((item, index) => {
                return (
                    <div >
                        <Link to={`/product/${item?._id}`}>
                        <h3 className="title"> {item?.title  }</h3>
                        <img src={item?.images[0].url } className="img" />
                        </Link>
                        
                    </div>
                )
            })}
            </Slider>
        </div>
    )
}
export default SliderImg;
