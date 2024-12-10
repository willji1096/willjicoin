import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { 
  fetchNews, 
  NEWS_CATEGORIES_LIST, 
  SORT_OPTIONS, 
  TIME_FRAME_OPTIONS 
} from '../utils/api';
import { FaRegClock, FaRegBookmark } from 'react-icons/fa';
import MarketOverview from './MarketOverview';
import RecommendedYoutubers from './RecommendedYoutubers';
import TwitterFeeds from './TwitterFeeds';
import NewsModal from './NewsModal';

const NewsPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const FeaturedNews = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainArticle = styled.a`
  grid-column: 1 / -1;
  position: relative;
  height: 480px;
  border-radius: 20px;
  overflow: hidden;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: flex-end;
  
  @media (max-width: 768px) {
    height: 400px;
  }

  @media (max-width: 480px) {
    height: 300px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 30%,
      rgba(0, 0, 0, 0.7) 60%,
      rgba(0, 0, 0, 0.95) 100%
    );
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.3s ease;
  }
`;

const MainArticleImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${MainArticle}:hover & {
    transform: scale(1.05);
  }
`;

const MainArticleContent = styled.div`
  position: relative;
  padding: 32px;
  z-index: 2;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubArticle = styled.a`
  position: relative;
  height: 280px;
  border-radius: 20px;
  overflow: hidden;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: flex-end;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 30%,
      rgba(0, 0, 0, 0.7) 60%,
      rgba(0, 0, 0, 0.95) 100%
    );
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    transition: transform 0.3s ease;
  }
`;

const ArticleImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${MainArticle}:hover & {
    transform: scale(1.05);
  }
`;

const ArticleContent = styled.div`
  position: relative;
  padding: 32px;
  z-index: 2;
  width: 100%;
  margin-top: auto;
`;

const NewsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eaeaea;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const NewsCard = styled.a`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  border: 1px solid #eaeaea;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  top: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const NewsImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const NewsContent = styled.div`
  padding: 20px;
`;

const NewsCategory = styled.span`
  color: #3498db;
  font-size: 0.9rem;
  font-weight: 500;
`;

const NewsTitle = styled.h3`
  font-size: ${props => props.featured ? '2rem' : '1.2rem'};
  font-weight: 700;
  margin: 8px 0;
  line-height: 1.4;
  color: ${props => props.featured ? 'white' : '#1a1a1a'};

  @media (max-width: 768px) {
    font-size: ${props => props.featured ? '1.5rem' : '1.1rem'};
  }
`;

const NewsMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${props => props.featured ? '#eee' : '#666'};
  font-size: 0.9rem;
  margin-top: 12px;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LoadingMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  background: white;
  border-radius: 16px;
  border: 1px solid #eaeaea;
  padding: 40px;
  gap: 20px;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const LanguageSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const LanguageButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  background: ${props => props.active ? props.theme.primary : props.theme.surface};
  color: ${props => props.active ? 'white' : props.theme.text.primary};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

const LoadMoreButton = styled.button`
  width: 100%;
  padding: 16px;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  color: ${props => props.theme.text.primary};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.theme.card.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NewsCount = styled.div`
  text-align: center;
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 16px;
`;

function handleImageError(e) {
  e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
}

const formatDate = (timestamp) => {
  try {
    return new Date(timestamp * 1000).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return '날짜 정보 없음';
  }
};

function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('popular');
  const [timeFrame, setTimeFrame] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('ALL');
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsPerPage, setNewsPerPage] = useState(15);

  const loadNews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const newsData = await fetchNews({
        page: pageNum,
        category,
        sortOrder,
        timeFrame,
        searchQuery,
        lang: 'ALL',
        limit: 15
      });

      if (Array.isArray(newsData) && newsData.length > 0) {
        if (newsData.length < 15) {
          setHasMore(false);
        }

        if (pageNum === 1) {
          setNews(newsData);
        } else {
          setNews(prev => [...prev, ...newsData]);
        }
        setError(null);
      } else {
        setError('뉴스를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('뉴스 로딩 실패:', error);
      setError('뉴스를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialNews = async () => {
      await loadNews(1);
    };

    loadInitialNews();
    
    const interval = setInterval(() => {
      loadInitialNews();
    }, 300000);

    return () => clearInterval(interval);
  }, [category, searchQuery]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      loadNews(page);
    }
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNewsClick = (e, news) => {
    e.preventDefault();
    setSelectedNews(news);
  };

  const handleLoadMore = () => {
    setNewsPerPage(prev => prev + 15);
  };

  if (loading && news.length === 0) {
    return <LoadingMessage>뉴스를 불러오는 중입니다...</LoadingMessage>;
  }

  if (error && news.length === 0) {
    return <LoadingMessage>{error}</LoadingMessage>;
  }

  if (!loading && news.length === 0) {
    return <LoadingMessage>표시할 뉴스가 없습니다.</LoadingMessage>;
  }

  const featuredNews = news.slice(0, 3);
  const latestNews = news.slice(3, 3 + newsPerPage);
  const remainingNews = news.slice(3 + newsPerPage);

  return (
    <NewsPageContainer>
      <MainGrid>
        <MainColumn>
          <FeaturedNews>
            <MainArticle 
              href={featuredNews[0]?.url} 
              onClick={(e) => handleNewsClick(e, featuredNews[0])}
            >
              <MainArticleImage 
                src={featuredNews[0]?.imageurl} 
                alt={featuredNews[0]?.title}
                onError={handleImageError}
                loading="lazy"
              />
              <MainArticleContent>
                <NewsCategory>주요뉴스</NewsCategory>
                <NewsTitle featured>{featuredNews[0]?.title}</NewsTitle>
                <NewsMetadata featured>
                  <MetadataItem>
                    <FaRegClock />
                    {formatDate(featuredNews[0]?.published_on)}
                  </MetadataItem>
                  <MetadataItem>
                    <FaRegBookmark />
                    저장
                  </MetadataItem>
                </NewsMetadata>
              </MainArticleContent>
            </MainArticle>
            {featuredNews.slice(1).map(item => (
              <SubArticle 
                key={item.id} 
                href={item.url}
                onClick={(e) => handleNewsClick(e, item)}
              >
                <ArticleImage src={item.imageurl} alt={item.title} />
                <ArticleContent>
                  <NewsCategory>추천뉴스</NewsCategory>
                  <NewsTitle featured>{item.title}</NewsTitle>
                  <NewsMetadata featured>
                    <MetadataItem>
                      <FaRegClock />
                      {formatDate(item.published_on)}
                    </MetadataItem>
                  </NewsMetadata>
                </ArticleContent>
              </SubArticle>
            ))}
          </FeaturedNews>

          <NewsSection>
            <SectionTitle>최신 뉴스</SectionTitle>
            <NewsCount>전체 {news.length}개 중 {3 + newsPerPage}개 표시 중</NewsCount>
            <NewsGrid>
              {latestNews.map(item => (
                <NewsCard 
                  key={item.id} 
                  href={item.url}
                  onClick={(e) => handleNewsClick(e, item)}
                >
                  <NewsImage src={item.imageurl} alt={item.title} />
                  <NewsContent>
                    <NewsCategory>최신뉴스</NewsCategory>
                    <NewsTitle>{item.title}</NewsTitle>
                    <NewsMetadata>
                      <MetadataItem>
                        <FaRegClock />
                        {formatDate(item.published_on)}
                      </MetadataItem>
                    </NewsMetadata>
                  </NewsContent>
                </NewsCard>
              ))}
            </NewsGrid>
            {remainingNews.length > 0 && (
              <LoadMoreButton 
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? '로딩 중...' : '더보기'}
                {!loading && <span>({remainingNews.length}개 더 있음)</span>}
              </LoadMoreButton>
            )}
          </NewsSection>
        </MainColumn>
      </MainGrid>
      <LanguageSelector>
        <LanguageButton 
          active={language === 'ALL'} 
          onClick={() => setLanguage('ALL')}
        >
          전체
        </LanguageButton>
        <LanguageButton 
          active={language === 'KR'} 
          onClick={() => setLanguage('KR')}
        >
          한국어
        </LanguageButton>
        <LanguageButton 
          active={language === 'EN'} 
          onClick={() => setLanguage('EN')}
        >
          영어
        </LanguageButton>
      </LanguageSelector>

      {selectedNews && (
        <NewsModal 
          news={selectedNews} 
          onClose={() => setSelectedNews(null)} 
        />
      )}
    </NewsPageContainer>
  );
}

export default NewsFeed; 