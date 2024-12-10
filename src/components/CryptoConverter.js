import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaExchangeAlt } from 'react-icons/fa';

const CRYPTOCOMPARE_API_KEY = '331bc436cc64daad41022375dda5e36c925556dbfaa57d531d0ee98549c8ff2d';

const ConverterWrapper = styled.div`
  padding: 0;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const CategoryTab = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text.secondary};
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.primary + '10'};
  }
`;

const ConverterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CurrencyBox = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background: white;

  &:focus-within {
    border-color: ${props => props.theme.primary};
  }
`;

const CurrencySelect = styled.select`
  border: none;
  background: transparent;
  color: ${props => props.theme.text.primary};
  font-size: 0.9rem;
  cursor: pointer;
  padding-right: 12px;
  min-width: 120px;

  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  border: none;
  background: transparent;
  font-size: 0.9rem;
  flex: 1;
  text-align: right;
  padding: 0 8px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${props => props.theme.text.tertiary};
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${props => props.theme.border};
  margin: 0 8px;
`;

const SwapButton = styled.button`
  color: ${props => props.theme.text.secondary};
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  
  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const ExchangeRate = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  margin: 4px 0;
  text-align: right;
`;

const CURRENCIES = {
  CRYPTO: [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'BNB', label: 'Binance Coin (BNB)' },
    { value: 'XRP', label: 'Ripple (XRP)' },
    { value: 'ADA', label: 'Cardano (ADA)' },
    { value: 'SOL', label: 'Solana (SOL)' },
    { value: 'DOGE', label: 'Dogecoin (DOGE)' }
  ],
  FIAT: [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'KRW', label: 'Korean Won (KRW)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'CNY', label: 'Chinese Yuan (CNY)' }
  ]
};

function CryptoConverter() {
  const [category, setCategory] = useState('crypto-fiat');
  const [fromCurrency, setFromCurrency] = useState('BTC');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrencyOptions = (type) => {
    switch (category) {
      case 'crypto-fiat':
        return type === 'from' ? CURRENCIES.CRYPTO : CURRENCIES.FIAT;
      case 'crypto-crypto':
        return CURRENCIES.CRYPTO;
      case 'fiat-fiat':
        return CURRENCIES.FIAT;
      default:
        return [];
    }
  };

  useEffect(() => {
    switch (category) {
      case 'crypto-fiat':
        setFromCurrency('BTC');
        setToCurrency('USD');
        break;
      case 'crypto-crypto':
        setFromCurrency('BTC');
        setToCurrency('ETH');
        break;
      case 'fiat-fiat':
        setFromCurrency('USD');
        setToCurrency('EUR');
        break;
    }
  }, [category]);

  const convertCurrency = async () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    try {
      setLoading(true);
      const response = await axios.get('https://min-api.cryptocompare.com/data/price', {
        params: {
          fsym: fromCurrency,
          tsyms: toCurrency,
          api_key: CRYPTOCOMPARE_API_KEY
        }
      });

      const rate = response.data[toCurrency];
      const convertedAmount = parseFloat(amount) * rate;
      setResult({
        amount: convertedAmount,
        rate: rate
      });
    } catch (error) {
      console.error('환율 변환 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      convertCurrency();
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ConverterWrapper>
      <CategoryTabs>
        <CategoryTab 
          active={category === 'crypto-fiat'} 
          onClick={() => setCategory('crypto-fiat')}
        >
          Crypto Fiat
        </CategoryTab>
        <CategoryTab 
          active={category === 'crypto-crypto'} 
          onClick={() => setCategory('crypto-crypto')}
        >
          Crypto Crypto
        </CategoryTab>
        <CategoryTab 
          active={category === 'fiat-fiat'} 
          onClick={() => setCategory('fiat-fiat')}
        >
          Fiat Fiat
        </CategoryTab>
      </CategoryTabs>

      <ConverterForm onSubmit={(e) => e.preventDefault()}>
        <CurrencyBox>
          <CurrencySelect
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {getCurrencyOptions('from').map(currency => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </CurrencySelect>
          <Divider />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </CurrencyBox>

        <SwapButton onClick={handleSwap}>
          <FaExchangeAlt />
        </SwapButton>

        <CurrencyBox>
          <CurrencySelect
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {getCurrencyOptions('to').map(currency => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </CurrencySelect>
          <Divider />
          <Input
            type="text"
            value={result ? result.amount.toFixed(4) : ''}
            readOnly
            placeholder={loading ? 'Converting...' : 'Result'}
          />
        </CurrencyBox>

        {result && (
          <ExchangeRate>
            1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
          </ExchangeRate>
        )}
      </ConverterForm>
    </ConverterWrapper>
  );
}

export default React.memo(CryptoConverter); 