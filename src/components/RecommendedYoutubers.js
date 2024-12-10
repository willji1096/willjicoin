import React, { useState } from 'react';
import styled from 'styled-components';
import { FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';

const YoutuberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const YoutuberCard = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.card.hover};
    transform: translateX(4px);
  }
`;

const YoutuberImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${props => props.theme.background};
`;

const YoutuberInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const YoutuberName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  margin-bottom: 2px;
`;

const YoutuberDesc = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const CategoryTab = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary + '10'};
  }
`;

const ExternalIcon = styled(FaExternalLinkAlt)`
  font-size: 12px;
  color: ${props => props.theme.text.tertiary};
`;

// 유튜버 데이터
const YOUTUBERS = {
  korean: [
    {
      id: 'k1',
      name: '김프로',
      imageUrl: 'https://yt3.ggpht.com/JuRFjYGQAc9BH6zrfBgo1XoZlotxVQAEWHxZYhcaFALZPY1cXxnSdOZqwVS1PZXZ5G0jqbxL=s176-c-k-c0x00ffffff-no-rj',
      description: '암호화폐 전문 분석 채널',
      subscribers: '821000',
      channelUrl: 'https://www.youtube.com/@kimpro_'
    },
    {
      id: 'k2',
      name: '코인데스크코리아',
      imageUrl: 'https://yt3.ggpht.com/HPBTXJt5cGRwz_kXhHYZAIXH9Y3oZZ-oqdVXaZGXvqXbhQOB_L_g0pYL-RXFFXzRSGZxqHKC=s176-c-k-c0x00ffffff-no-rj',
      description: '글로벌 암호화폐 미디어',
      subscribers: '453000',
      channelUrl: 'https://www.youtube.com/@coindeskkorea'
    },
    {
      id: 'k3',
      name: '에이블',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZRGxX2bI_M7gOzm2YJ1DuwZ1Ys_o_p5C3-b5lYb=s176-c-k-c0x00ffffff-no-rj',
      description: '기술적 분석 전문',
      subscribers: '432000',
      channelUrl: 'https://www.youtube.com/@able_crypto'
    },
    {
      id: 'k4',
      name: '코인원',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZTNYQbOXS1RJxl9lMxKrXhzh8BWqnJH7PXp4kUc=s176-c-k-c0x00ffffff-no-rj',
      description: '암호화폐 거래소 공식 채널',
      subscribers: '415000',
      channelUrl: 'https://www.youtube.com/@coinone'
    },
    {
      id: 'k5',
      name: '업비트',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQDHCkwomh_hX8YbE-zs5ofyHXxGR6aRJ6B5Z9D=s176-c-k-c0x00ffffff-no-rj',
      description: '국내 최대 암호화폐 거래소',
      subscribers: '380000',
      channelUrl: 'https://www.youtube.com/@upbit'
    }
  ],
  global: [
    {
      id: 'g1',
      name: 'Coin Bureau',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZTZAk7HXv9tUgZXk_83I3yxGZgml3r9_kxKrKOL=s176-c-k-c0x00ffffff-no-rj',
      description: 'Crypto Education & Analysis',
      subscribers: '2320000',
      channelUrl: 'https://www.youtube.com/@CoinBureau'
    },
    {
      id: 'g2',
      name: 'Crypto Banter',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZRvCXBY4OPDZhkt_-8DJLdV4qzGEZgkm_nf7YGw=s176-c-k-c0x00ffffff-no-rj',
      description: 'Live Crypto Analysis',
      subscribers: '987000',
      channelUrl: 'https://www.youtube.com/@CryptoBanter'
    },
    {
      id: 'g3',
      name: 'Altcoin Daily',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQtYf4WEZRyFfVDTODIHlXqKtMBWRMGEbS9DxJB=s176-c-k-c0x00ffffff-no-rj',
      description: 'Daily Market Updates',
      subscribers: '883000',
      channelUrl: 'https://www.youtube.com/@AltcoinDaily'
    },
    {
      id: 'g4',
      name: 'Digital Asset News',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZSVVJOJB_3C5ZvtwwXB7A3rHmwUXnOL6k41KHBd=s176-c-k-c0x00ffffff-no-rj',
      description: 'Daily Crypto Updates',
      subscribers: '1120000',
      channelUrl: 'https://www.youtube.com/@DigitalAssetNews'
    },
    {
      id: 'g5',
      name: 'InvestAnswers',
      imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQHPBV6lHXrEQKEPeNHGEjSgoX4Tab5vgLn4Xm_Mg=s176-c-k-c0x00ffffff-no-rj',
      description: 'Crypto Investment Analysis',
      subscribers: '1280000',
      channelUrl: 'https://www.youtube.com/@InvestAnswers'
    }
  ]
};

function RecommendedYoutubers() {
  const [category, setCategory] = useState('korean');

  return (
    <>
      <CategoryTabs>
        <CategoryTab 
          active={category === 'korean'} 
          onClick={() => setCategory('korean')}
        >
          국내 크리에이터
        </CategoryTab>
        <CategoryTab 
          active={category === 'global'} 
          onClick={() => setCategory('global')}
        >
          해외 크리에이터
        </CategoryTab>
      </CategoryTabs>

      <YoutuberList>
        {YOUTUBERS[category].map(youtuber => (
          <YoutuberCard 
            key={youtuber.id} 
            href={youtuber.channelUrl} 
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutuberImage 
              src={youtuber.imageUrl} 
              alt={youtuber.name}
              loading="lazy"
            />
            <YoutuberInfo>
              <YoutuberName>{youtuber.name}</YoutuberName>
              <YoutuberDesc>
                {youtuber.subscribers} {category === 'korean' ? '구독자' : 'subscribers'} • {youtuber.description}
              </YoutuberDesc>
            </YoutuberInfo>
            <ExternalIcon />
          </YoutuberCard>
        ))}
      </YoutuberList>
    </>
  );
}

export default React.memo(RecommendedYoutubers); 