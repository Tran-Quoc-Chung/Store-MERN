import React from "react";
import { Link, useLocation } from "react-router-dom";
import BreadCrumb from "../components/BreadCrumb";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Meta from "../components/Meta";
import blog from "../images/blog-1.jpg";
import Container from "../components/Container";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBlog } from "../features/blogs/blogSlice";

const SingleBlog = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const getBlogId = location.pathname.split("/")[2];
  useEffect(() => {
    getSingleBlog();
  }, []);
  const getSingleBlog = () => {
    dispatch(getBlog(getBlogId));
  }
  const blogState = useSelector((state) => state?.blog?.SingleBlog);

  return (
    <>
      {blogState && (
        <>
          <Meta title={"Dynamic Blog Name"} />
          <BreadCrumb title="Dynamic Blog Name" />
          <Container class1="blog-wrapper home-wrapper-2 py-5">
            <div className="row">
              <div className="col-12">
                <div className="single-blog-card">
                  <Link to="/blogs" className="d-flex align-items-center gap-10">
                    <HiOutlineArrowLeft className="fs-4" /> Go back to Blogs
                  </Link>
                  <h3 className="title">{blogState.title}</h3>
                  <img src={blogState?.images[0]?.url} className="img-fluid w-100 my-4" alt="blog" />
                  <p className="desc" dangerouslySetInnerHTML={{ __html: blogState?.description?.substring(0, 70) + "..." }}></p>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
    </>
  );
  
};

export default SingleBlog;
