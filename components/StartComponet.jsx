import React from "react";
import { FaStarHalf } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";

const StartComponet = ({ totalReviews, stars }) => {
  const ratingStar = Array.from({ length: 5 }, (ele, idx) => {
    let number = idx + 0.5;

    return (
      <span key={idx} className="flex gap-2">
        {stars >= idx + 1 ? (
          <FaStar />
        ) : stars >= number ? (
          <FaStarHalf />
        ) : (
          <AiOutlineStar />
        )}
      </span>
    );
  });
  return (
    <>
      {
        <div className="flex items-center gap-2">
          {totalReviews <= 0 ? (
            <div className="flex items-center gap-2">
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
              <AiOutlineStar />
            </div>
          ) : (
            ratingStar
          )}{" "}
          - {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
        </div>
      }
    </>
  );
};

export default StartComponet;
