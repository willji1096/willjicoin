import React from 'react';
import styled from 'styled-components';
import { FaTimes, FaRegClock, FaExternalLinkAlt } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.surface};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: ${props => props.theme.text.secondary};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.card.hover};
    color: ${props => props.theme.text.primary};
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const NewsTitle = styled.h2`
  font-size: 1.8rem;
  color: ${props => props.theme.text.primary};
  margin-bottom: 16px;
  line-height: 1.4;
`;

const NewsMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 24px;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NewsContent = styled.div`
  color: ${props => props.theme.text.primary};
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 24px;
`;

const ReadMoreButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.theme.primary};
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
  }
`;

const NewsSource = styled.div`
  margin-bottom: 16px;
  padding: 8px 16px;
  background: ${props => props.theme.card.hover};
  border-radius: 8px;
  display: inline-block;
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
`;

function NewsModal({ news, onClose }) {
  if (!news) return null;

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes size={24} />
        </CloseButton>
        <NewsImage src={news.imageurl} alt={news.title} />
        <NewsSource>{news.source}</NewsSource>
        <NewsTitle>{news.title}</NewsTitle>
        <NewsMetadata>
          <MetadataItem>
            <FaRegClock />
            {formatDate(news.published_on)}
          </MetadataItem>
        </NewsMetadata>
        <NewsContent>
          {news.body}
        </NewsContent>
        <ReadMoreButton href={news.url} target="_blank" rel="noopener noreferrer">
          원문 보기
          <FaExternalLinkAlt />
        </ReadMoreButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default NewsModal; 