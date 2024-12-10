import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMarketData } from '../utils/api';
import { FaCaretUp, FaCaretDown } from 'react-icons/fa';

const TickerContainer = styled.div`
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 8px 0;
  margin-top: 60px;
  position: sticky;
  top: 60px;
  z-index: 100;
  backdrop-filter: blur(8px);
`;

const TickerWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
`;

const TickerTrack = styled.div`
  display: flex;
  width: fit-content;
  animation: ticker 30s linear infinite;

  &:hover {
    animation-play-state: paused;
  }

  @keyframes ticker {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`;

const TickerList = styled.div`
  display: flex;
  gap: 32px;
  padding: 0 16px;
`;

const TickerItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: ${props => props.theme.text.primary};
  padding: 4px 8px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }
`;

const CoinIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const CoinSymbol = styled.span`
  font-weight: 500;
  font-size: 14px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Price = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const PriceChange = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 14px;
  color: ${props => props.isPositive ? props.theme.positive : props.theme.negative};
`;

function CoinTicker() {
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMarketData();
      setMarketData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10초마다 업데이트

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

  return (
    <TickerContainer>
      <TickerWrapper>
        <TickerTrack>
          <TickerList>
            {Object.entries(marketData).map(([coin, data]) => (
              <TickerItem key={coin} href={`/market/${coin.toLowerCase()}`}>
                <CoinIcon src={coinIcons[coin]} alt={coin} />
                <CoinSymbol>{coin}</CoinSymbol>
                <PriceInfo>
                  <Price>{formatPrice(data.price)}</Price>
                  <PriceChange isPositive={data.priceChange > 0}>
                    {data.priceChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
                    {Math.abs(data.priceChange).toFixed(2)}%
                  </PriceChange>
                </PriceInfo>
              </TickerItem>
            ))}
          </TickerList>
          <TickerList>
            {Object.entries(marketData).map(([coin, data]) => (
              <TickerItem key={`${coin}-clone`} href={`/market/${coin.toLowerCase()}`}>
                <CoinIcon src={coinIcons[coin]} alt={coin} />
                <CoinSymbol>{coin}</CoinSymbol>
                <PriceInfo>
                  <Price>{formatPrice(data.price)}</Price>
                  <PriceChange isPositive={data.priceChange > 0}>
                    {data.priceChange > 0 ? <FaCaretUp /> : <FaCaretDown />}
                    {Math.abs(data.priceChange).toFixed(2)}%
                  </PriceChange>
                </PriceInfo>
              </TickerItem>
            ))}
          </TickerList>
        </TickerTrack>
      </TickerWrapper>
    </TickerContainer>
  );
}

export default CoinTicker; 