import React, { useCallback } from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const ControlButton = styled.button`
  padding: 10px 15px;
  margin: 0 5px;
  border: none;
  border-radius: 6px;
  background: #3498DB;
  color: white;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: 3px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }
`;

const AccessibilityControls = ({ onIncreaseFontSize, onDecreaseFontSize }) => {
  const handleIncrease = useCallback((e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      onIncreaseFontSize();
    }
  }, [onIncreaseFontSize]);

  const handleDecrease = useCallback((e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      onDecreaseFontSize();
    }
  }, [onDecreaseFontSize]);

  return (
    <ControlsContainer role="toolbar" aria-label="글자 크기 조절">
      <ControlButton 
        onClick={handleIncrease}
        onKeyPress={handleIncrease}
        aria-label="글자 크게"
      >
        글자 크게 (A+)
      </ControlButton>
      <ControlButton 
        onClick={handleDecrease}
        onKeyPress={handleDecrease}
        aria-label="글자 작게"
      >
        글자 작게 (A-)
      </ControlButton>
    </ControlsContainer>
  );
};

export default React.memo(AccessibilityControls); 