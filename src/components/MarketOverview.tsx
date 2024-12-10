import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchMarketData } from '../utils/api';

const OverviewContainer = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.base};
  margin-bottom: ${props => props.theme.spacing.base};
  box-shadow: ${props => props.theme.shadows.small};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.base};
`;

const CoinCard = styled.div`
  padding: ${props => props.theme.spacing.base};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius};
  text-align: center;
`;

const PriceText = styled.p<{ isPositive?: boolean }>`
  color: ${props => props.isPositive ? '#2ecc71' : '#e74c3c'};
  font-size: ${props => props.theme.fonts.large};
  font-weight: bold;
`;

const MarketOverview = () => {
  const [marketData, setMarketData] = useState<any>({});
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
    const interval = setInterval(fetchData, 30000); // 30초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <OverviewContainer>데이터를 불러오는 중...</OverviewContainer>;
  }

  return (
    <OverviewContainer>
      <h2>실시간 시장 동향</h2>
      <Grid>
        {Object.entries(marketData).map(([coin, data]: [string, any]) => (
          <CoinCard key={coin}>
            <h3>{coin}</h3>
            <PriceText isPositive={data.priceChange > 0}>
              {data.price.toLocaleString()} USD
            </PriceText>
            <PriceText isPositive={data.priceChange > 0}>
              {data.priceChange > 0 ? '+' : ''}{data.priceChange}%
            </PriceText>
          </CoinCard>
        ))}
      </Grid>
    </OverviewContainer>
  );
};

export default MarketOverview; 