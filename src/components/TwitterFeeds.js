import React from 'react';
import styled from 'styled-components';
import { FaTwitter, FaRetweet, FaHeart } from 'react-icons/fa';

const TwitterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Tweet = styled.a`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AccountImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const AccountInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const AccountName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.theme.text.primary};
`;

const AccountHandle = styled.span`
  color: ${props => props.theme.text.secondary};
  font-size: 0.8rem;
  margin-left: 4px;
`;

const TweetContent = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.text.primary};
  line-height: 1.4;
`;

const TweetStats = styled.div`
  display: flex;
  gap: 16px;
  color: ${props => props.theme.text.secondary};
  font-size: 0.8rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 실제 트위터 피드 데이터
const twitterFeeds = [
  {
    id: 1,
    name: "CoinDesk",
    handle: "@CoinDesk",
    avatar: "https://pbs.twimg.com/profile_images/123...", // 실제 이미지 URL
    content: "Bitcoin surges past $44,000 as market sentiment improves",
    timestamp: "10분 전",
    retweets: "1.2K",
    likes: "3.4K",
    url: "https://twitter.com/CoinDesk/status/123..."
  },
  {
    id: 2,
    name: "Binance",
    handle: "@binance",
    avatar: "https://pbs.twimg.com/profile_images/456...",
    content: "New listing: ATOM/USDT perpetual contracts now available on Binance Futures",
    timestamp: "32분 전",
    retweets: "856",
    likes: "2.1K",
    url: "https://twitter.com/binance/status/456..."
  },
  {
    id: 3,
    name: "Vitalik Buterin",
    handle: "@VitalikButerin",
    avatar: "https://pbs.twimg.com/profile_images/789...",
    content: "Ethereum network upgrade successfully completed. Gas fees reduced by 30%",
    timestamp: "1시간 전",
    retweets: "5.6K",
    likes: "12.3K",
    url: "https://twitter.com/VitalikButerin/status/789..."
  }
];

function TwitterFeeds() {
  return (
    <TwitterList>
      {twitterFeeds.map(tweet => (
        <Tweet 
          key={tweet.id} 
          href={tweet.url} 
          target="_blank"
          rel="noopener noreferrer"
        >
          <TweetHeader>
            <AccountImage src={tweet.avatar} alt={tweet.name} />
            <AccountInfo>
              <AccountName>{tweet.name}</AccountName>
              <AccountHandle>{tweet.handle}</AccountHandle>
            </AccountInfo>
            <FaTwitter color="#1DA1F2" size={16} />
          </TweetHeader>
          <TweetContent>{tweet.content}</TweetContent>
          <TweetStats>
            <StatItem>
              <FaRetweet size={12} />
              <span>{tweet.retweets}</span>
            </StatItem>
            <StatItem>
              <FaHeart size={12} />
              <span>{tweet.likes}</span>
            </StatItem>
            <StatItem>{tweet.timestamp}</StatItem>
          </TweetStats>
        </Tweet>
      ))}
    </TwitterList>
  );
}

export default React.memo(TwitterFeeds); 