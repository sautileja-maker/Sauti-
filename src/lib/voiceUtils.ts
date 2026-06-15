// Mock voice recognition for browsers without native support
export const mockVoiceRecognition = async (): Promise<string> => {
  const mockTransactions = [
    'I sold tomatoes for 500 shillings',
    'Sold 10 kilos of onions for 800',
    'Bananas sold, 300 shillings total',
    'Sold maize for 1200 shillings',
    'Vegetables sold for 450 shillings',
  ];
  
  return mockTransactions[Math.floor(Math.random() * mockTransactions.length)];
};

// Extract transaction details from text
export const extractTransactionDetails = (text: string) => {
  // Simple regex patterns for common transaction formats
  const priceMatch = text.match(/(\d+)\s*(ksh|shilling|kes|shs)/i);
  const productMatch = text.match(/(tomatoes|onions|bananas|maize|vegetables|rice|beans|potatoes|carrots|cabbage)/i);
  
  const revenue = priceMatch ? parseInt(priceMatch[1]) : 0;
  const productName = productMatch ? productMatch[1] : '';
  
  return {
    productName,
    revenue,
    quantity: 1,
    category: 'Produce',
    date: new Date().toISOString().split('T')[0],
  };
};
