import React from "react";

const Color = ({colorList,chooseColor}) => {
  const  color  = colorList;

  const setColorFromChild = (color) => {
    chooseColor(color)
  }
  return (
    <>
      <ul className="colors ps-0">
        {
          color && color.map((item, index) => {
            return (
              <li style={{backgroundColor: item.title ,cursor:"pointer" }} onClick={()=>setColorFromChild(item._id)}></li>
            )
          })
      }
      </ul>
    </>
  );
};

export default Color;
