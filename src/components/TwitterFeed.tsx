import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchTwitterFeed } from '../utils/api';

const TwitterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.base};
`;

const Tweet = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius};
  padding: ${props => props.theme.spacing.base};
  box-shadow: ${props => props.theme.shadows.small};
`;

const TweetHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.small};
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: ${props => props.theme.spacing.small};
`;

const TwitterFeed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTweets = async () => {
      try {
        const data = await fetchTwitterFeed();
        setTweets(data);
      } catch (error) {
        console.error('트위터 피드 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTweets();
  }, []);

  if (loading) {
    return <div>트위터 피드를 불러오는 중...</div>;
  }

  return (
    <TwitterContainer>
      {tweets.map((tweet: any) => (
        <Tweet key={tweet.id}>
          <TweetHeader>
            <Avatar src={tweet.author.profile_image_url} alt={tweet.author.name} />
            <div>
              <h4>{tweet.author.name}</h4>
              <p>@{tweet.author.username}</p>
            </div>
          </TweetHeader>
          <p>{tweet.text}</p>
        </Tweet>
      ))}
    </TwitterContainer>
  );
};

export default TwitterFeed; 