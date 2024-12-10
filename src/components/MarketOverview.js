import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMarketData } from '../utils/api';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const CoinList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CoinItem = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s ease;
  text-decoration: none;
  color: ${props => props.theme.text.primary};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const CoinInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CoinIcon = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

const CoinNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CoinName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.theme.text.primary};
`;

const CoinSymbol = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
`;

const PriceInfo = styled.div`
  text-align: right;
`;

const PriceValue = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: ${props => props.theme.text.primary};
  margin-bottom: 2px;
`;

const PriceChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 0.8rem;
  color: ${props => props.isPositive ? props.theme.positive : props.theme.negative};
  font-weight: 500;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LoadingContainer = styled.div`
  padding: 32px;
  text-align: center;
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
`;

const MarketOverview = () => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchMarketData();
        setMarketData(data);
      } catch (error) {
        console.error('시장 데이터 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const coinIcons = {
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    XRP: 'https://cryptologos.cc/logos/xrp-xrp-logo.png',
    ADA: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png'
  };

  const coinNames = {
    BTC: '비트코인',
    ETH: '이더리움',
    BNB: '바이낸�� 코인',
    XRP: '리플',
    ADA: '카르다노',
    DOGE: '도지코인',
    SOL: '솔라나'
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      });
    }
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  if (loading) {
    return <LoadingContainer>시장 데이터를 불러오는 중...</LoadingContainer>;
  }

  return (
    <CoinList>
      {Object.entries(marketData).map(([coin, data]) => (
        <CoinItem 
          key={coin} 
          isPositive={data.priceChange > 0}
          href={`/market/${coin.toLowerCase()}`}
        >
          <CoinInfo>
            <CoinIcon src={coinIcons[coin]} alt={coin} />
            <CoinNameWrapper>
              <CoinName>{coinNames[coin]}</CoinName>
              <CoinSymbol>{coin}</CoinSymbol>
            </CoinNameWrapper>
          </CoinInfo>
          <PriceInfo>
            <PriceValue>{formatPrice(data.price)}</PriceValue>
            <PriceChange isPositive={data.priceChange > 0}>
              {data.priceChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
              {Math.abs(data.priceChange).toFixed(2)}%
            </PriceChange>
          </PriceInfo>
        </CoinItem>
      ))}
    </CoinList>
  );
};

export default MarketOverview; 