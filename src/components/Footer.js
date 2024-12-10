import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: #fff;
  border-top: 1px solid #eaeaea;
  padding: 40px 0;
  margin-top: auto;
`;

const FooterInner = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const FooterLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  text-decoration: none;

  span {
    color: #3498db;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  max-width: 400px;
  line-height: 1.6;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 24px;
  }
`;

const LinkGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LinkTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const FooterLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    color: #3498db;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterInner>
        <FooterLeft>
          <Logo to="/">
            시니어<span>코인</span>
          </Logo>
          <Description>
            시니어를 위한 신뢰할 수 있는 암호화폐 뉴스와 정보를 제공합니다.
          </Description>
        </FooterLeft>
        <FooterLinks>
          <LinkGroup>
            <LinkTitle>서비스</LinkTitle>
            <FooterLink to="/">뉴스</FooterLink>
            <FooterLink to="/market">시세</FooterLink>
            <FooterLink to="/dictionary">용어사전</FooterLink>
          </LinkGroup>
          <LinkGroup>
            <LinkTitle>고객지원</LinkTitle>
            <FooterLink to="/about">회사소개</FooterLink>
            <FooterLink to="/terms">이용약관</FooterLink>
            <FooterLink to="/privacy">개인정보처리방침</FooterLink>
          </LinkGroup>
        </FooterLinks>
      </FooterInner>
    </FooterContainer>
  );
}

export default Footer; 