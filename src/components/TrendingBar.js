import React from 'react';
import styled from 'styled-components';
import { FaFire } from 'react-icons/fa';

const TrendingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 24px;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TrendingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e74c3c;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TrendingItem = styled.a`
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 4px 12px;
  border-radius: 16px;
  background: ${props => props.highlighted ? '#fff3f3' : 'transparent'};
  
  &:hover {
    background: #f8f9fa;
  }
`;

function TrendingBar() {
  const trendingTopics = [
    { id: 1, text: "비트코인 신고가 갱신", highlighted: true },
    { id: 2, text: "이더리움 2.0 업데이트" },
    { id: 3, text: "바이낸스 뉴스" },
    { id: 4, text: "리플 소송 진행상황" },
    { id: 5, text: "코인베이스 실적 발��" },
    { id: 6, text: "NFT 시장 동향" }
  ];

  return (
    <TrendingContainer>
      <TrendingLabel>
        <FaFire />
        트렌딩
      </TrendingLabel>
      {trendingTopics.map(topic => (
        <TrendingItem 
          key={topic.id} 
          href="#"
          highlighted={topic.highlighted}
        >
          {topic.text}
        </TrendingItem>
      ))}
    </TrendingContainer>
  );
}

export default TrendingBar; 