import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";

export default function AddReview() {
  const { swapId, revieweeId } = useParams();
  console.log(revieweeId)
  const [data, setData] = useState({
    rating: 0,
    comment: "",
  });
  const navigate = useNavigate();

  const OnSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    try {
      const res = await api.post("/review/add", {
        swapId,
        revieweeId,
        rating: data.rating,
        comment: data.comment,
      });
      if (res.status === 200) {
        alert("review added");
        navigate("/swaps");
      }
    } catch (error) {
      if (error.response) {
        
          alert(error.response.message);
        
      } else {
        console.error(error.message);
        alert("Network error!");
      }
    }
  };

  return (
    <>
      <h1>Review</h1>
      <form onSubmit={OnSubmit}>
        <p>Rating</p>
        <input
          type="number"
          onChange={(e) => setData({ ...data, rating: Number(e.target.value) })}
          max={5}
          min={0}
          placeholder="0"
        />
        <p>Comment</p>
        <input
          type="text"
          placeholder="Excelent"
          onChange={(e) => setData({ ...data, comment: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
