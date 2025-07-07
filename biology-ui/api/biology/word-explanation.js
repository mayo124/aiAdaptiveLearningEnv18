export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const { word, context } = req.body;
  
  if (!word) {
    res.status(400).json({ 
      success: false, 
      error: 'Word is required' 
    });
    return;
  }

  const startTime = Date.now();
  
  try {
    const explanation = await generateWordExplanation(word, context || 'biology');
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    res.status(200).json({
      success: true,
      word,
      explanation,
      responseTime,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating word explanation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate word explanation',
      responseTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }
}

async function generateWordExplanation(word, context) {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    // Return demo explanation if no API key
    return `Demo explanation for "${word}": This is a biology-related term that plays an important role in understanding biological processes. In the context of ${context}, this term refers to key concepts that students should understand as part of their biology education.`;
  }
  
  const prompt = `You are a biology expert providing clear, concise explanations for students.

Explain the term "${word}" in the context of ${context}. 

Provide a comprehensive but concise explanation (100-150 words) that includes:
- Clear definition
- Biological significance
- Key functions or characteristics
- How it relates to other biological concepts

Make the explanation accessible to students while maintaining scientific accuracy.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No explanation available.';
}
