import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 300px;
  background: #f8f9fa;
  padding: 20px;
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
  overflow-y: auto;
`;

const SidebarSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarSection>
        <SectionTitle>실시간 시세</SectionTitle>
      </SidebarSection>
    </SidebarContainer>
  );
}

export default Sidebar;