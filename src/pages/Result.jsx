import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

function Result() {
  const { result } = useContext(GameContext);
  const navigate = useNavigate();

  if (!result) return null;

  return (
    <div>
      <h2>게임 결과</h2>
      <div>사유: {result.reason}</div>
      <div>턴: {result.turn}</div>
      <div>보유 머니: {result.money.toLocaleString()}원</div>
      <div>
        <h3>투자 내역</h3>
        {result.investments.map((item, idx) => (
          <div key={idx}>
            {item.name}: {item.price.toLocaleString()}원 (보유: {item.amount})
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>처음으로</button>
    </div>
  );
}

export default Result;