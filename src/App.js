import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import GlobalStyle from './styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import CoinTicker from './components/CoinTicker';
import CryptoConverter from './components/CryptoConverter';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
`;

const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 20px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 380px;
  gap: 40px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 320px;
    gap: 24px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.section`
  min-width: 0;
`;

const SideSection = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const AdBanner = styled.div`
  max-width: 1440px;
  margin: 0 auto 32px;
  padding: 0 20px;
  height: 120px;
  background: ${props => props.theme.surface};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text.secondary};
  font-size: 1.2rem;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    height: 80px;
    font-size: 1rem;
  }
`;

const SideCard = styled.div`
  background: ${props => props.theme.surface};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.border};
  transition: background-color 0.3s ease;
`;

const SideTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.text.primary};
  margin: 0 0 16px 0;
`;

const FirstSideCard = styled(SideCard)`
  margin-top: 0;
`;

// Code splitting을 위한 lazy loading
const NewsFeed = lazy(() => import('./components/NewsFeed'));
const MarketOverview = lazy(() => import('./components/MarketOverview'));
const RecommendedYoutubers = lazy(() => import('./components/RecommendedYoutubers'));
const TwitterFeeds = lazy(() => import('./components/TwitterFeeds'));

// 에러 바운더리 컴포넌트 추가
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>오류가 발생했습니다</h2>
          <p>페이지를 새로고침 해주세요.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// 로딩 컴포넌트
const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme.text.secondary};
`;

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // 테마 토글 함수 메모이제이션
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Router>
          <GlobalStyle />
          <AppContainer>
            <Header 
              isDarkMode={isDarkMode} 
              toggleTheme={toggleTheme}
              aria-label="메인 헤더"
            />
            <CoinTicker aria-label="실시간 코인 시세" />
            <MainWrapper>
              <ContentWrapper>
                <AdBanner role="banner">
                  광고 배너 영역
                </AdBanner>
                <MainContent>
                  <MainSection>
                    <Suspense fallback={<LoadingFallback>로딩중...</LoadingFallback>}>
                      <Routes>
                        <Route path="/" element={<NewsFeed />} />
                      </Routes>
                    </Suspense>
                  </MainSection>
                  <SideSection aria-label="사이드바">
                    <Suspense fallback={<LoadingFallback>로딩중...</LoadingFallback>}>
                      <SideCard>
                        <SideTitle>코인 변환기</SideTitle>
                        <CryptoConverter />
                      </SideCard>
                      <SideCard>
                        <SideTitle>실시간 시장 동향</SideTitle>
                        <MarketOverview />
                      </SideCard>
                      <SideCard>
                        <SideTitle>추천 유튜버</SideTitle>
                        <RecommendedYoutubers />
                      </SideCard>
                      <SideCard>
                        <SideTitle>코인 소식</SideTitle>
                        <TwitterFeeds />
                      </SideCard>
                    </Suspense>
                  </SideSection>
                </MainContent>
              </ContentWrapper>
            </MainWrapper>
          </AppContainer>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default React.memo(App); 