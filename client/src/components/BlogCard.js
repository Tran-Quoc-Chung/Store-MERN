import React from "react";
import { Link } from "react-router-dom";


const BlogCard = (props) => {
  const { id, title, description, image, date } = props;

  return (
    <div className="blog-card">
      <div className="card-image">
        <img src={image ? image : "../images/loading.gif"} className="img-fluid w-100" alt="blog" />
      </div>
      <div className="blog-content">
        <p className="date">{date}</p>
        <h5 className="title">{title}</h5>
        {description && (
          <p className="desc" dangerouslySetInnerHTML={{ __html: description.substring(0, 70) + "..." }}></p>
        )}
        <Link to={`/blog/${id}`} className="button">
          Read More
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
