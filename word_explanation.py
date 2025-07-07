#!/usr/bin/env python3
"""
Word Explanation System - AI-powered word definitions and etymologies
Provides comprehensive explanations for words in educational context
"""
import os
import sys
import requests
import json

def get_word_explanation(word, context="general"):
    """Get comprehensive explanation for a word using Groq API"""
    
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key or groq_api_key == 'your_groq_api_key_here':
        print(f"🔧 No valid API key found, using demo mode", file=sys.stderr)
        return generate_demo_explanation(word, context)
    
    print(f"🤖 Using Groq API with key: {groq_api_key[:10]}...", file=sys.stderr)
    
    groq_url = "https://api.groq.com/openai/v1/chat/completions"
    
    # Create a comprehensive prompt for word explanation
    prompt = f"""Provide a comprehensive explanation for the word "{word}" in the context of {context}. 

Format your response exactly as follows:

Explanation: [Provide a clear, concise definition in 1-2 sentences]
Context: [Explain how this word is used in {context} context, with a specific example]
Etymology: [Provide the origin and historical development of the word]
Alternative Words: [List 3-4 synonyms or related terms, separated by commas]

Make sure the explanation is educational and appropriate for students. Focus on accuracy and clarity."""

    try:
        response = requests.post(
            groq_url,
            headers={
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-70b-8192",
                "messages": [
                    {
                        "role": "system", 
                        "content": "You are an educational assistant specializing in providing clear, accurate word definitions and etymologies. Always format your responses exactly as requested."
                    },
                    {
                        "role": "user", 
                        "content": prompt
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 400,
                "top_p": 0.9
            },
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            explanation = result['choices'][0]['message']['content']
            return explanation
        else:
            # Fall back to demo mode if API fails
            return generate_demo_explanation(word, context)
            
    except requests.exceptions.Timeout:
        return generate_demo_explanation(word, context)
    except Exception as e:
        return generate_demo_explanation(word, context)

def generate_demo_explanation(word, context):
    DEMO_EXPLANATIONS = {
        "photosynthesis": {
            "explanation": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll.",
            "context": "In biology, photosynthesis is fundamental to understanding how plants produce energy and release oxygen that supports life on Earth.",
            "etymology": "From Greek 'photos' (light) and 'synthesis' (putting together), literally meaning 'putting together with light'.",
            "alternatives": "light synthesis, chlorophyll process, plant energy production, carbon fixation"
        },
        "dna": {
            "explanation": "DNA (deoxyribonucleic acid) is the hereditary material that contains genetic instructions for the development of all living organisms.",
            "context": "In genetics, DNA is the molecule that stores genetic information and passes traits from parents to offspring.",
            "etymology": "Named for its chemical structure: 'deoxy' (lacking oxygen), 'ribose' (a sugar), and 'nucleic acid'.",
            "alternatives": "genetic material, hereditary molecule, genetic code, genome"
        },
        "cell": {
            "explanation": "Cells are the smallest structural and functional units of life, containing all the necessary components for an organism to survive.",
            "context": "In cell biology, understanding cell structure and function is essential for comprehending how all living organisms operate.",
            "etymology": "From Latin 'cella' meaning 'small room', named by Robert Hooke who observed cork cells under a microscope.",
            "alternatives": "cellular unit, biological unit, life unit, organism building block"
        }
    }

    word_data = DEMO_EXPLANATIONS.get(word.lower())
    if word_data:
        return f"""Explanation: {word_data['explanation']}
Context: {word_data['context']}
Etymology: {word_data['etymology']}
Alternative Words: {word_data['alternatives']}"""
    else:
        return f"""Explanation: {word.title()} is an important term in {context}.
Context: This term is commonly used in {context} to describe key concepts and processes.
Etymology: The word has roots in scientific terminology developed over centuries of study.
Alternative Words: concept, term, element, component"""

def main():
    if len(sys.argv) < 2:
        print("Error: Word parameter required")
        sys.exit(1)
    
    word = sys.argv[1].strip()
    context = sys.argv[2].strip() if len(sys.argv) > 2 else "general"
    
    if not word:
        print("Error: Empty word provided")
        sys.exit(1)
    
    # Get explanation from AI
    explanation = get_word_explanation(word, context)
    
    # Print the explanation (this will be captured by Node.js)
    print(explanation)

if __name__ == "__main__":
    main()
