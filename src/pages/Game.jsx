import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

const TURN_FEE_BASE = 10000; // 기본 턴 진행 머니

function getTurnFee(turn) {
  // 지수 공식: 기본값 * (1.1 ^ (턴 - 1))
  // 1턴: 10,000원, 2턴: 11,000원, 3턴: 12,100원, 4턴: 13,310원...
  return Math.round(TURN_FEE_BASE * Math.pow(1.1, turn - 1));
}

const INIT_INVESTMENTS = [
  { name: "A주식", price: 100000, amount: 0, priceHistory: [100000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "B코인", price: 50000, amount: 0, priceHistory: [50000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "C펀드", price: 200000, amount: 0, priceHistory: [200000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "D주식", price: 120000, amount: 0, priceHistory: [120000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "E코인", price: 80000, amount: 0, priceHistory: [80000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "F펀드", price: 150000, amount: 0, priceHistory: [150000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "G주식", price: 90000, amount: 0, priceHistory: [90000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "H코인", price: 60000, amount: 0, priceHistory: [60000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "I펀드", price: 180000, amount: 0, priceHistory: [180000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "J주식", price: 110000, amount: 0, priceHistory: [110000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "K코인", price: 70000, amount: 0, priceHistory: [70000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
  { name: "L펀드", price: 130000, amount: 0, priceHistory: [130000], consecutiveDown: 0, isDelisted: false, delistRiskTurns: 0 },
];

// 뉴스(호재/루머) 포맷 데이터
const NEWS_FORMATS = {
  real: [
    { effect: 1.2, message: '{name}이 대형 호재로 급등했습니다!' },
    { effect: 1.15, message: '{name}이 좋은 실적을 발표했습니다!' },
    { effect: 1.18, message: '{name}에 투자자 유입이 급증했습니다!' },
    { effect: 1.12, message: '{name}이 신기술 개발에 성공했습니다!' },
    { effect: 1.25, message: '{name}이 대형 계약을 체결했습니다!' },
    { effect: 0.8, message: '{name}에 악재가 발생해 급락했습니다.' },
    { effect: 0.85, message: '{name}이 규제 이슈로 하락했습니다.' },
    { effect: 0.75, message: '{name}이 실적 부진으로 하락했습니다.' },
    { effect: 0.9, message: '{name}에 투자자 이탈이 발생했습니다.' },
    { effect: 0.7, message: '{name}이 대형 손실을 발표했습니다.' }
  ],
  rumor: [
    { effect: 1, message: '{name}이 곧 상장폐지된다는 소문이 돌고 있습니다.' },
    { effect: 1, message: '{name}이 대박 호재가 있다는 루머가 있습니다.' },
    { effect: 1, message: '{name} 개발자가 잠적했다는 소문이 있습니다.' },
    { effect: 1, message: '{name}이 해외 진출한다는 미확인 정보가 있습니다.' },
    { effect: 1, message: '{name}이 인수합병된다는 루머가 퍼지고 있습니다.' },
    { effect: 1, message: '{name}이 상장폐지 위기에 처했다는 소문이 있습니다.' },
    { effect: 1, message: '{name}이 규제로 인해 상장폐지될 수 있다는 루머가 있습니다.' },
    { effect: 1, message: '{name}이 대형 투자를 받는다는 소문이 있습니다.' },
    { effect: 1, message: '{name}이 신기술을 개발했다는 미확인 정보가 있습니다.' },
    { effect: 1, message: '{name}이 경영진 교체를 검토한다는 루머가 있습니다.' },
    { effect: 1, message: '{name}이 실적 조작 의혹을 받고 있다는 소문이 있습니다.' },
    { effect: 1, message: '{name}이 대형 손실을 숨기고 있다는 루머가 있습니다.' }
  ]
};

function getRandomChange() {
  // -10% ~ +10% 랜덤 변동
  return 1 + (Math.random() * 0.2 - 0.1);
}

function Game() {
  const {
    nickname, money, setMoney,
    turn, setTurn,
    investments, setInvestments,
    setGameOver, setResult
  } = useContext(GameContext);

  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'buy' or 'sell'
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [inputAmount, setInputAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (investments.length === 0) {
      setInvestments(INIT_INVESTMENTS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (type, idx) => {
    setModalType(type);
    setSelectedIdx(idx);
    setInputAmount(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedIdx(null);
    setInputAmount(0);
  };

  const handleBuySell = () => {
    if (selectedIdx === null) return;
    const item = investments[selectedIdx];
    let newInvestments = [...investments];
    let newMoney = money;
    const amount = parseInt(inputAmount);
    if (modalType === 'buy') {
      const totalPrice = item.price * amount;
      if (amount > 0 && newMoney >= totalPrice) {
        // 투자 후 남은 머니가 턴 진행 머니보다 적은지 확인
        const remainingMoney = newMoney - totalPrice;
        if (remainingMoney < getTurnFee(turn)) {
          const confirmMessage = `경고: 이 투자를 하면 남은 머니(${remainingMoney.toLocaleString()}원)가 턴 진행 머니(${getTurnFee(turn).toLocaleString()}원)보다 적어집니다.\n\n정말로 투자하시겠습니까?`;
          if (!window.confirm(confirmMessage)) {
            return;
          }
        }
        
        newInvestments[selectedIdx] = {
          ...item,
          amount: item.amount + amount,
        };
        newMoney -= totalPrice;
        setInvestments(newInvestments);
        setMoney(newMoney);
        closeModal();
      } else {
        alert('잔액이 부족하거나 잘못된 수량입니다.');
      }
    } else if (modalType === 'sell') {
      if (amount > 0 && item.amount >= amount) {
        newInvestments[selectedIdx] = {
          ...item,
          amount: item.amount - amount,
        };
        newMoney += item.price * amount;
        setInvestments(newInvestments);
        setMoney(newMoney);
        closeModal();
      } else {
        alert('보유 수량이 부족하거나 잘못된 수량입니다.');
      }
    }
  };

  const nextTurn = () => {
    // 턴 진행 머니 확인 및 경고
    const currentTurnFee = getTurnFee(turn);
    if (money < currentTurnFee) {
      const warningMessage = `⚠️ 경고: 보유 머니(${money.toLocaleString()}원)가 턴 진행 머니(${currentTurnFee.toLocaleString()}원)보다 적습니다!\n\n계속 진행하시면 파산됩니다.`;
      if (!window.confirm(warningMessage)) {
        return;
      }
    }
    
    // 수수료 차감
    if (money < currentTurnFee) {
      setGameOver(true);
      setResult({ reason: "파산", turn, investments, money });
      navigate("/result");
      return;
    }
    setMoney(money - currentTurnFee);

    // 루머 뉴스 먼저 발생 (가격 변동 전)
    let rumorMessages = [];
    if (Math.random() < 0.3) { // 30% 확률로 루머 발생
      const rumorCount = Math.floor(Math.random() * 3) + 1; // 1~3개의 루머
      for (let i = 0; i < rumorCount; i++) {
        // 상장폐지되지 않고 위험 상태가 아닌 종목들 중에서 랜덤 선택
        const availableItems = investments.filter((item, idx) => 
          !item.isDelisted && item.delistRiskTurns === 0
        );
        
        if (availableItems.length > 0) {
          const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
          const randomFormat = NEWS_FORMATS.rumor[Math.floor(Math.random() * NEWS_FORMATS.rumor.length)];
          const message = randomFormat.message.replace('{name}', randomItem.name);
          rumorMessages.push(message);
        }
      }
    }

    // 투자 항목 가격 변동
    let newInvestments = investments.map(item => {
      if (item.isDelisted) {
        return item; // 상장폐지된 종목은 가격 변동 없음
      }
      
      const newPrice = Math.round(item.price * getRandomChange());
      const newPriceHistory = [...item.priceHistory, newPrice].slice(-6); // 최근 6개 (현재 포함)
      
      // 연속 하락 카운트 계산
      let newConsecutiveDown = item.consecutiveDown;
      let newDelistRiskTurns = item.delistRiskTurns;
      
      if (newPrice < item.price) {
        newConsecutiveDown += 1;
      } else {
        newConsecutiveDown = 0; // 상승하면 리셋
        newDelistRiskTurns = 0; // 상승하면 위험 상태도 리셋
      }
      
      // 상장폐지 위험 상태 체크 (5턴 연속 하락시 위험 상태 시작)
      if (newConsecutiveDown >= 5 && newDelistRiskTurns === 0) {
        newDelistRiskTurns = 1; // 위험 상태 시작
      } else if (newDelistRiskTurns > 0) {
        // 위험 상태에서 계속 하락하면 위험 상태 연장
        if (newPrice < item.price) {
          newDelistRiskTurns += 1; // 위험 상태 지속
        } else {
          newDelistRiskTurns = 0; // 상승하면 위험 상태 해제
        }
      }
      
      // 상장폐지 체크 (위험 상태에서 30% 확률로 상장폐지)
      let isDelisted = item.isDelisted;
      if (newDelistRiskTurns > 0 && Math.random() < 0.3) {
        isDelisted = true;
        newDelistRiskTurns = 0; // 상장폐지되면 위험 상태 리셋
      }
      
      return {
        ...item,
        price: newPrice,
        priceHistory: newPriceHistory,
        consecutiveDown: newConsecutiveDown,
        isDelisted: isDelisted,
        delistRiskTurns: newDelistRiskTurns,
      };
    });

    // 실제 뉴스 발생 (가격 변동 후)
    let realNewsMessages = [];
    if (Math.random() < 0.4) { // 40% 확률로 실제 뉴스 발생
      const realNewsCount = Math.floor(Math.random() * 2) + 1; // 1~2개의 실제 뉴스
      for (let i = 0; i < realNewsCount; i++) {
        // 상장폐지되지 않고 위험 상태가 아닌 종목들 중에서 랜덤 선택
        const availableItems = newInvestments.filter((item, idx) => 
          !item.isDelisted && item.delistRiskTurns === 0
        );
        
        if (availableItems.length > 0) {
          const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
          const randomFormat = NEWS_FORMATS.real[Math.floor(Math.random() * NEWS_FORMATS.real.length)];
          const message = randomFormat.message.replace('{name}', randomItem.name);
          realNewsMessages.push(message);
          
          // 실제 효과 반영
          newInvestments = newInvestments.map((item, idx) => {
            if (item.name === randomItem.name && !item.isDelisted) {
              const newPrice = Math.round(item.price * randomFormat.effect);
              const newPriceHistory = [...item.priceHistory.slice(0, -1), newPrice];
              return { ...item, price: newPrice, priceHistory: newPriceHistory };
            }
            return item;
          });
        }
      }
    }

    // 상장폐지 메시지 추가
    const delistedItems = newInvestments.filter(item => item.isDelisted && !investments.find(oldItem => oldItem.name === item.name && oldItem.isDelisted));
    if (delistedItems.length > 0) {
      delistedItems.forEach(item => {
        realNewsMessages.push(`${item.name}이 상장폐지되었습니다!`);
      });
    }

    // 모든 뉴스 메시지 합치기
    let allMessages = [];
    if (rumorMessages.length > 0) {
      rumorMessages.forEach(rumor => {
        allMessages.push(`📢 루머: ${rumor}`);
      });
    }
    if (realNewsMessages.length > 0) {
      realNewsMessages.forEach(news => {
        allMessages.push(`📰 뉴스: ${news}`);
      });
    }
    
    setInvestments(newInvestments);
    setMessage(allMessages.join('\n'));
    setTurn(turn + 1);
  };

  const handleEnd = () => {
    setResult({ reason: "자진 종료", turn, investments, money });
    navigate("/result");
  };

  // 간단한 그래프 컴포넌트
  const PriceGraph = ({ priceHistory, name }) => {
    // 첫 턴에도 그래프 표시
    const displayHistory = priceHistory.length === 1 ? [priceHistory[0], priceHistory[0]] : priceHistory;
    
    const maxPrice = Math.max(...displayHistory);
    const minPrice = Math.min(...displayHistory);
    const range = maxPrice - minPrice || 1;
    
    // 차트 내부 여백을 위한 패딩 설정
    const padding = 8; // 픽셀 단위
    const chartWidth = 100 - (padding * 2 / 50) * 100; // 50px 높이 기준으로 퍼센트 계산
    const chartHeight = 100 - (padding * 2 / 50) * 100;
    
    const points = displayHistory.map((price, index) => {
      const x = padding + (index / (displayHistory.length - 1)) * chartWidth;
      const y = padding + (100 - ((price - minPrice) / range) * 100) * (chartHeight / 100);
      return `${x}%,${y}%`;
    }).join(' ');
    
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>가격 변화</div>
        <div style={{ 
          width: '100%', 
          height: '50px', 
          background: '#ffffff', 
          borderRadius: '4px',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #ddd'
        }}>
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            {/* 가격 변화 선 */}
            <polyline
              points={points}
              fill="none"
              stroke="#0D47A1"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* 가격 포인트들 */}
            {displayHistory.map((price, index) => {
              const x = padding + (index / (displayHistory.length - 1)) * chartWidth;
              const y = padding + (100 - ((price - minPrice) / range) * 100) * (chartHeight / 100);
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="5"
                  fill="#0D47A1"
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
            })}
            {/* 현재 가격 표시 (가장 오른쪽 포인트 강조) */}
            {displayHistory.length > 0 && (
              <circle
                cx={`${padding + chartWidth}%`}
                cy={`${padding + (100 - ((displayHistory[displayHistory.length - 1] - minPrice) / range) * 100) * (chartHeight / 100)}%`}
                r="6"
                fill="#FF5722"
                stroke="#fff"
                strokeWidth="2"
              />
            )}
          </svg>
        </div>
        <div style={{ fontSize: '8px', color: '#888', marginTop: '2px' }}>
          {displayHistory.length > 1 && displayHistory[displayHistory.length - 1] !== displayHistory[displayHistory.length - 2] && (
            <span style={{ color: displayHistory[displayHistory.length - 1] > displayHistory[displayHistory.length - 2] ? '#4CAF50' : '#f44336' }}>
              {displayHistory[displayHistory.length - 1] > displayHistory[displayHistory.length - 2] ? '↗' : '↘'}
            </span>
          )}
          이전: {displayHistory.length > 1 ? displayHistory[displayHistory.length - 2].toLocaleString() : displayHistory[0].toLocaleString()}원
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>{nickname}님의 게임</h2>
      
      {/* 헤더 섹션 */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #ddd'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>턴: {turn}</strong>
          </div>
          <div>
            <strong>보유 머니: {money.toLocaleString()}원</strong>
          </div>
          <div>
            <strong>턴 진행 머니: {getTurnFee(turn).toLocaleString()}원</strong>
          </div>
        </div>
      </div>

      {/* 투자 섹션 */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #ddd',
        position: 'relative'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>투자 종목</h3>
        
        {/* 투자 테이블 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '60px' // 다음 턴 버튼 공간 확보
        }}>
          {investments.map((item, idx) => (
            <div key={idx} style={{ 
              border: '1px solid #eee', 
              padding: '12px', 
              borderRadius: '4px',
              background: item.isDelisted ? '#ffebee' : item.delistRiskTurns > 0 ? '#fff3e0' : '#fafafa',
              opacity: item.isDelisted ? 0.6 : 1
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px', color: item.isDelisted ? '#d32f2f' : item.delistRiskTurns > 0 ? '#ff9800' : 'inherit' }}>
                {item.name}
                {item.isDelisted && <span style={{ fontSize: '10px', color: '#d32f2f', marginLeft: '4px' }}>(상장폐지)</span>}
                {item.delistRiskTurns > 0 && <span style={{ fontSize: '10px', color: '#ff9800', marginLeft: '4px' }}>(위험)</span>}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {item.isDelisted ? '상장폐지' : `${item.price.toLocaleString()}원`}
              </div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                보유: {item.amount}
              </div>
              {!item.isDelisted && <PriceGraph priceHistory={item.priceHistory || [item.price]} name={item.name} />}
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                <button 
                  style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px',
                    background: item.isDelisted ? '#ccc' : item.delistRiskTurns > 0 ? '#ff9800' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.isDelisted ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={() => !item.isDelisted && openModal('buy', idx)}
                  disabled={item.isDelisted}
                  title={item.delistRiskTurns > 0 ? '상장폐지 위험 상태입니다!' : ''}
                >
                  투자
                </button>
                <button 
                  style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px',
                    background: item.isDelisted ? '#ccc' : item.delistRiskTurns > 0 ? '#ff9800' : '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: item.isDelisted ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={() => !item.isDelisted && openModal('sell', idx)}
                  disabled={item.isDelisted}
                  title={item.delistRiskTurns > 0 ? '상장폐지 위험 상태입니다!' : ''}
                >
                  판매
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 다음 턴 버튼 */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px' 
        }}>
          <button 
            onClick={nextTurn}
            style={{
              fontSize: '18px',
              padding: '12px 24px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            다음 턴
          </button>
        </div>
      </div>

      {/* 뉴스 메시지 */}
      {message && (
        <div style={{ 
          background: '#e3f2fd', 
          padding: '12px', 
          borderRadius: '4px', 
          marginTop: '16px',
          border: '1px solid #2196F3',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>
      )}

      {/* 게임 종료 버튼 */}
      {turn > 40 && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button 
            onClick={handleEnd}
            style={{
              fontSize: '16px',
              padding: '10px 20px',
              background: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            게임 종료
          </button>
        </div>
      )}

      {modalOpen && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
            <h3>{modalType === 'buy' ? '투자(매수)' : '판매(매도)'}</h3>
            <div>
              {selectedIdx !== null && (
                <>
                  <div>종목: {investments[selectedIdx].name}</div>
                  <div>현재가: {investments[selectedIdx].price.toLocaleString()}원</div>
                  <div>보유: {investments[selectedIdx].amount}</div>
                  <input
                    type="number"
                    min="1"
                    value={inputAmount}
                    onChange={e => setInputAmount(e.target.value)}
                    placeholder="수량 입력"
                    style={{ marginTop: 8, width: '100%' }}
                  />
                </>
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <button onClick={handleBuySell} style={{ marginRight: 8 }}>확인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;