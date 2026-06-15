// Voice utilities for handling voice input and transcription

export const mockVoiceRecognition = async (): Promise<string> => {
  // Mock voice recognition responses
  const mockResponses = [
    'Sold twenty sukuma wiki for eight hundred shillings',
    'Sold fifteen tomatoes for five hundred shillings',
    'Sold ten eggs for two thousand shillings',
    'Sold five kilos of beans for three thousand shillings',
  ];

  return mockResponses[Math.floor(Math.random() * mockResponses.length)];
};

export const extractTransactionDetails = (text: string): any => {
  // Extract numbers and product details from recognized text
  const numberRegex = /\d+/g;
  const numbers = text.match(numberRegex) || [];

  // Simple extraction logic
  let quantity = 1;
  let revenue = 0;
  let productName = 'Unknown Product';

  if (numbers.length >= 2) {
    quantity = parseInt(numbers[0]);
    revenue = parseInt(numbers[1]);
  } else if (numbers.length === 1) {
    revenue = parseInt(numbers[0]);
  }

  // Extract product name
  const productWords = text.toLowerCase().split(' ');
  const keywords = {
    'sukuma': 'Sukuma Wiki',
    'tomato': 'Tomatoes',
    'egg': 'Eggs',
    'bean': 'Beans',
    'vegetable': 'Vegetables',
    'rice': 'Rice',
    'grain': 'Grains',
    'milk': 'Milk',
    'cheese': 'Cheese',
  };

  for (const word of productWords) {
    for (const [keyword, name] of Object.entries(keywords)) {
      if (word.includes(keyword)) {
        productName = name;
        break;
      }
    }
  }

  return {
    productName,
    quantity,
    revenue,
    category: 'Produce',
  };
};
