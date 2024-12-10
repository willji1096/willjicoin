import axios from 'axios';

const CRYPTOCOMPARE_API_KEY = '331bc436cc64daad41022375dda5e36c925556dbfaa57d531d0ee98549c8ff2d';
const BASE_URL = 'https://min-api.cryptocompare.com/data';

const NEWS_CATEGORIES = {
  ALL: 'ALL',
  BTC: 'BTC',
  ETH: 'ETH',
  DEFI: 'DEFI',
  NFT: 'NFT',
  REGULATION: 'REGULATION',
  MINING: 'MINING',
  TECHNOLOGY: 'TECHNOLOGY'
};

const NEWS_FEEDS = [
  'tokenpost',
  'decenter',
  'coinreaders',
  'blockmedia',
  'coindeskkorea',
  'cointelegraph',
  'coindesk',
  'bitcoinist',
  'decrypt',
  'theblock',
  'cryptoslate'
];

// API 에러 처리 개선
class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

// API 요청 래퍼 함수
const apiRequest = async (url, options = {}) => {
  try {
    const response = await axios(url, {
      ...options,
      timeout: 10000, // 10초 타임아웃
      headers: {
        ...options.headers,
        'Authorization': `Apikey ${CRYPTOCOMPARE_API_KEY}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new APIError(
        error.response.data.message || '서버 오류가 발생했습니다',
        error.response.status
      );
    }
    if (error.request) {
      throw new APIError('네트워크 연결에 실패했습니다', 0);
    }
    throw error;
  }
};

// 캐싱 구현
const cache = new Map();
const CACHE_DURATION = 60000; // 1분

export const fetchMarketData = async () => {
  const cacheKey = 'marketData';
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const data = await apiRequest(`${BASE_URL}/pricemultifull`, {
      params: {
        fsyms: 'BTC,ETH,BNB,XRP,ADA,DOGE,SOL',
        tsyms: 'USD,KRW'
      }
    });

    const formattedData = formatMarketData(data);
    cache.set(cacheKey, {
      timestamp: Date.now(),
      data: formattedData
    });

    return formattedData;
  } catch (error) {
    console.error('시장 데이터 로딩 실패:', error);
    throw error;
  }
};

export const fetchNews = async (options = {}) => {
  const {
    page = 1,
    limit = 15,
    category = NEWS_CATEGORIES.ALL,
    sortOrder = 'popular',
    feeds = NEWS_FEEDS,
    searchQuery = '',
    timeFrame = '7d',
    lang = 'ALL'
  } = options;

  try {
    let params = {
      api_key: CRYPTOCOMPARE_API_KEY,
      sortOrder: sortOrder,
      feeds: feeds.join(','),
      limit: limit,
      page: page
    };

    // 언어 필터링
    if (lang !== 'ALL') {
      params.lang = lang;
    }

    const response = await axios.get(`${BASE_URL}/v2/news/`, { params });

    if (!response.data?.Data) {
      throw new Error('뉴스 데이터가 없습니다.');
    }

    return processNewsData(response.data.Data);
  } catch (error) {
    console.error('뉴스 API 호출 실패:', error);
    return [];
  }
};

// 뉴스 데이터 처리 함수 개선
const processNewsData = (newsData) => {
  return newsData
    .filter(item => (
      item.title && 
      item.body && 
      item.imageurl &&
      !item.title.includes('Sponsored') && // 스폰서 콘텐츠 제외
      !item.body.includes('Sponsored')
    ))
    .map(item => ({
      id: item.id,
      title: item.title,
      body: item.body,
      summary: item.body.substring(0, 200) + '...',
      url: item.url,
      imageurl: item.imageurl,
      source: item.source,
      source_info: item.source_info,
      published_on: item.published_on,
      categories: item.categories.split('|').filter(Boolean),
      tags: item.tags ? item.tags.split('|').filter(Boolean) : [],
      sentiment: calculateSentiment(item.title + ' ' + item.body),
      relevance_score: calculateRelevanceScore(item)
    }))
    .sort((a, b) => b.relevance_score - a.relevance_score);
};

// 뉴스 관련성 점수 계산
const calculateRelevanceScore = (item) => {
  let score = 0;
  
  // 조회수나 인기도 반영
  if (item.views) score += item.views * 0.5;
  
  // 최신성 반영
  const hoursSincePublished = (Date.now() / 1000 - item.published_on) / 3600;
  score += Math.max(0, 100 - hoursSincePublished);
  
  // 주요 키워드 포함 여부
  const keywords = ['bitcoin', 'ethereum', 'crypto', 'blockchain'];
  keywords.forEach(keyword => {
    if (item.title.toLowerCase().includes(keyword)) score += 10;
    if (item.body.toLowerCase().includes(keyword)) score += 5;
  });

  return score;
};

// 감성 분석 함수 수정
const calculateSentiment = (text) => {
  const positiveWords = ['상승', '급등', '돌파', '성공', '개선', '혁신', '기대', 'bullish', 'surge', 'gain'];
  const negativeWords = ['하락', '급락', '폭락', '실패', '우려', '위험', '제재', 'bearish', 'crash', 'drop'];
  
  let score = 0;
  const lowerText = text.toLowerCase();
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) score += 1;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) score -= 1;
  });
  
  return score;
};

// 카테고리 목록 내보내기
export const NEWS_CATEGORIES_LIST = Object.entries(NEWS_CATEGORIES).map(([key, value]) => ({
  id: value,
  name: key === 'ALL' ? '전체' : value
}));

// 정렬 옵션 내보내기
export const SORT_OPTIONS = [
  { id: 'popular', name: '인기순' },
  { id: 'latest', name: '최신순' }
];

// 시간 범위 옵션 내보내기
export const TIME_FRAME_OPTIONS = [
  { id: '24h', name: '24시간' },
  { id: '7d', name: '7일' },
  { id: '30d', name: '30일' },
  { id: 'all', name: '전체' }
];

// 더미 뉴스 데이터
const getDummyNews = () => {
  // ... 기존 더미 데이터 유지
};

export const fetchCoinDetail = async (coinId) => {
  try {
    const response = await axios.get(`${BASE_URL}/coin/generalinfo`, {
      params: {
        fsyms: coinId,
        tsym: 'USD',
        api_key: CRYPTOCOMPARE_API_KEY
      }
    });

    return response.data.Data[0];
  } catch (error) {
    console.error('코인 상세 정보 API 호출 실패:', error);
    return null;
  }
};

const formatMarketData = (data) => {
  const { RAW } = data;
  const formattedData = {};

  Object.entries(RAW).forEach(([coin, data]) => {
    formattedData[coin] = {
      price: data.USD.PRICE,
      priceKRW: data.KRW.PRICE,
      priceChange: data.USD.CHANGEPCT24HOUR,
      volume24h: data.USD.VOLUME24HOUR,
      marketCap: data.USD.MKTCAP,
      high24h: data.USD.HIGH24HOUR,
      low24h: data.USD.LOW24HOUR,
      lastUpdate: data.USD.LASTUPDATE
    };
  });

  return formattedData;
};

// YouTube API 관련 함수 수정
const YOUTUBE_API_KEY = 'AIzaSyCw_6C8BsfCgGlWxpfzwJv79UUm9q2oRwU';
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchYoutubeChannels = async (channelIds) => {
  try {
    // 더미 데이터 반환
    const dummyData = {
      korean: [
        {
          id: 'UCxP5lK_FUuQLkHCRmzJFkZw',
          name: '김프로',
          imageUrl: 'https://yt3.ggpht.com/JuRFjYGQAc9BH6zrfBgo1XoZlotxVQAEWHxZYhcaFALZPY1cXxnSdOZqwVS1PZXZ5G0jqbxL=s176-c-k-c0x00ffffff-no-rj',
          description: '암호화폐 전문 분석 채널',
          subscribers: '821000',
          channelUrl: 'https://www.youtube.com/@kimpro_'
        },
        {
          id: 'UCM8V4qKxjpxcL7oWvsDzBBw',
          name: '코인데스크코리아',
          imageUrl: 'https://yt3.ggpht.com/HPBTXJt5cGRwz_kXhHYZAIXH9Y3oZZ-oqdVXaZGXvqXbhQOB_L_g0pYL-RXFFXzRSGZxqHKC=s176-c-k-c0x00ffffff-no-rj',
          description: '글로벌 암호화폐 미디어',
          subscribers: '453000',
          channelUrl: 'https://www.youtube.com/@coindeskkorea'
        },
        {
          id: 'UCvw-X4X7eklqZmZm8BRCEbg',
          name: '에이블',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZRGxX2bI_M7gOzm2YJ1DuwZ1Ys_o_p5C3-b5lYb=s176-c-k-c0x00ffffff-no-rj',
          description: '기술적 분석 전문',
          subscribers: '432000',
          channelUrl: 'https://www.youtube.com/@able_crypto'
        },
        {
          id: 'UCryTPdzp3u6NxwxnNZWQ1ig',
          name: '코인원',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZTNYQbOXS1RJxl9lMxKrXhzh8BWqnJH7PXp4kUc=s176-c-k-c0x00ffffff-no-rj',
          description: '암호화폐 거래소 공식 채널',
          subscribers: '415000',
          channelUrl: 'https://www.youtube.com/@coinone'
        },
        {
          id: 'UCB4yF-OGMhZw8-vXDmPOo2g',
          name: '업비트',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQDHCkwomh_hX8YbE-zs5ofyHXxGR6aRJ6B5Z9D=s176-c-k-c0x00ffffff-no-rj',
          description: '국내 최대 암호화폐 거래소',
          subscribers: '380000',
          channelUrl: 'https://www.youtube.com/@upbit'
        }
      ],
      global: [
        {
          id: 'UCqK_GSMbpiV8spgD3ZGloSw',
          name: 'Coin Bureau',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZTZAk7HXv9tUgZXk_83I3yxGZgml3r9_kxKrKOL=s176-c-k-c0x00ffffff-no-rj',
          description: 'Crypto Education & Analysis',
          subscribers: '2320000',
          channelUrl: 'https://www.youtube.com/@CoinBureau'
        },
        {
          id: 'UCRvqjQPSeaWn-uEx-w0XOIg',
          name: 'Crypto Banter',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZRvCXBY4OPDZhkt_-8DJLdV4qzGEZgkm_nf7YGw=s176-c-k-c0x00ffffff-no-rj',
          description: 'Live Crypto Analysis',
          subscribers: '987000',
          channelUrl: 'https://www.youtube.com/@CryptoBanter'
        },
        {
          id: 'UCL6JmiMXKoXS6sb1Q9sMmqw',
          name: 'Altcoin Daily',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQtYf4WEZRyFfVDTODIHlXqKtMBWRMGEbS9DxJB=s176-c-k-c0x00ffffff-no-rj',
          description: 'Daily Market Updates',
          subscribers: '883000',
          channelUrl: 'https://www.youtube.com/@AltcoinDaily'
        },
        {
          id: 'UCiUnrCUGCJTCC7KjuW493Ww',
          name: 'Digital Asset News',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZSVVJOJB_3C5ZvtwwXB7A3rHmwUXnOL6k41KHBd=s176-c-k-c0x00ffffff-no-rj',
          description: 'Daily Crypto Updates',
          subscribers: '1120000',
          channelUrl: 'https://www.youtube.com/@DigitalAssetNews'
        },
        {
          id: 'UCMtJYS0PrtiUwlk6zjGDEMA',
          name: 'InvestAnswers',
          imageUrl: 'https://yt3.ggpht.com/ytc/AIf8zZQHPBV6lHXrEQKEPeNHGEjSgoX4Tab5vgLn4Xm_Mg=s176-c-k-c0x00ffffff-no-rj',
          description: 'Crypto Investment Analysis',
          subscribers: '1280000',
          channelUrl: 'https://www.youtube.com/@InvestAnswers'
        }
      ]
    };

    const isKorean = channelIds.includes('UCxP5lK_FUuQLkHCRmzJFkZw');
    return isKorean ? dummyData.korean : dummyData.global;

  } catch (error) {
    console.error('YouTube API 호출 실패:', error);
    return null;
  }
}; 