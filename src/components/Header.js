import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch, FaBell, FaRegBookmark, FaMoon, FaSun } from 'react-icons/fa';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: ${props => props.theme.header.background};
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 ${props => props.theme.header.border};
  z-index: 1000;
  transition: all 0.3s ease;
`;

const HeaderInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: ${props => props.theme.text.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: ${props => props.theme.primary};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-left: 48px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${props => props.$active ? '#1a1a1a' : '#666'};
  font-weight: ${props => props.$active ? '600' : '400'};
  font-size: 16px;
  padding: 8px 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: #3498db;
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #1a1a1a;
    &::after {
      transform: scaleX(1);
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.text.secondary};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.theme.card.hover};
    color: ${props => props.theme.text.primary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  width: 240px;
  height: 36px;
  padding: 0 16px 0 36px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 18px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text.primary};

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.text.tertiary};
  }

  @media (max-width: 1024px) {
    width: 200px;
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: #e74c3c;
  border-radius: 50%;
`;

function Header({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <HeaderContainer style={{ 
      boxShadow: isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <HeaderInner>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Logo to="/">
            윌지<span>코인</span>
          </Logo>
          <Nav>
            <NavLink to="/" $active={location.pathname === '/'}>뉴스</NavLink>
            <NavLink to="/market" $active={location.pathname === '/market'}>시세</NavLink>
            <NavLink to="/dictionary" $active={location.pathname === '/dictionary'}>용어사전</NavLink>
            <NavLink to="/youtubers" $active={location.pathname === '/youtubers'}>추천 유튜버</NavLink>
          </Nav>
        </div>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon />
            <SearchInput placeholder="뉴스 검색하기..." />
          </SearchContainer>
          <IconButton>
            <FaRegBookmark />
          </IconButton>
          <IconButton>
            <FaBell />
            <NotificationBadge />
          </IconButton>
          <IconButton onClick={toggleTheme}>
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </IconButton>
        </HeaderActions>
      </HeaderInner>
    </HeaderContainer>
  );
}

export default Header; 