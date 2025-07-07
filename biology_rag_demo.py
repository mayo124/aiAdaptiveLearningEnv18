#!/usr/bin/env python3
"""
Biology RAG Demo System - Simplified version for demo purposes
Works without external databases, using predefined biology content
"""
import os
import sys
import json
import requests
import time

# Predefined biology knowledge base for demo
BIOLOGY_KNOWLEDGE = {
    "photosynthesis": {
        "content": "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen. This process occurs primarily in the chloroplasts of plant cells, specifically in the chlorophyll-containing thylakoids. The process consists of two main stages: the light-dependent reactions (photo reactions) and the light-independent reactions (Calvin cycle).",
        "chapter": "Plant Biology",
        "section": "Energy Production"
    },
    "dna": {
        "content": "DNA (Deoxyribonucleic acid) is the hereditary material in humans and almost all other organisms. It consists of two strands that form a double helix, with each strand made up of nucleotides containing a phosphate group, a sugar (deoxyribose), and one of four nitrogenous bases (A, T, G, C). DNA stores genetic information through the sequence of these bases.",
        "chapter": "Genetics",
        "section": "Molecular Genetics"
    },
    "cell": {
        "content": "Cells are the basic structural and functional units of all living organisms. There are two main types: prokaryotic cells (without a membrane-bound nucleus) and eukaryotic cells (with a membrane-bound nucleus). Eukaryotic cells contain organelles like mitochondria, endoplasmic reticulum, and Golgi apparatus that perform specific functions.",
        "chapter": "Cell Biology",
        "section": "Cell Structure"
    },
    "mitosis": {
        "content": "Mitosis is the process of cell division that results in two genetically identical diploid daughter cells. It consists of several phases: prophase, metaphase, anaphase, and telophase. During mitosis, chromosomes condense and align at the cell's center before being separated and distributed to daughter cells.",
        "chapter": "Cell Biology",
        "section": "Cell Division"
    },
    "evolution": {
        "content": "Evolution is the change in heritable traits of biological populations over successive generations. It occurs through mechanisms such as natural selection, genetic drift, mutation, and gene flow. Charles Darwin's theory of natural selection explains how organisms with favorable traits are more likely to survive and reproduce.",
        "chapter": "Evolution",
        "section": "Evolutionary Theory"
    },
    "enzyme": {
        "content": "Enzymes are biological catalysts that speed up chemical reactions in living organisms. They are typically proteins that lower the activation energy required for reactions to occur. Enzymes are highly specific, often working with only one or a few substrates, and their activity can be affected by factors like temperature, pH, and inhibitors.",
        "chapter": "Biochemistry",
        "section": "Molecular Biology"
    }
}

def find_relevant_content(topic):
    """Find relevant content for a given topic"""
    topic_lower = topic.lower()
    relevant_content = []
    
    # Direct matches
    for key, content in BIOLOGY_KNOWLEDGE.items():
        if key in topic_lower or topic_lower in key:
            relevant_content.append(content)
    
    # If no direct matches, search within content
    if not relevant_content:
        for key, content in BIOLOGY_KNOWLEDGE.items():
            if any(word in content['content'].lower() for word in topic_lower.split()):
                relevant_content.append(content)
    
    # If still no matches, provide general biology content
    if not relevant_content:
        relevant_content = [list(BIOLOGY_KNOWLEDGE.values())[0]]  # Default to first entry
    
    return relevant_content[:3]  # Return top 3 relevant pieces

def generate_response_with_groq(topic, context):
    """Generate response using Groq API"""
    groq_api_key = os.getenv('GROQ_API_KEY')
    if not groq_api_key or groq_api_key == 'your_groq_api_key_here':
        print(f"🔧 No valid API key found, using fallback", file=sys.stderr)
        return generate_fallback_response(topic, context)
    
    print(f"🤖 Using Groq API for topic: {topic}", file=sys.stderr)
    
    groq_url = "https://api.groq.com/openai/v1/chat/completions"
    
    context_text = "\n\n".join([f"[{content['chapter']} - {content['section']}]\n{content['content']}" for content in context])
    
    prompt = f"""Using the following biology textbook context, provide a comprehensive response about: {topic}

Context from Biology Textbook:
{context_text}

Provide a response with THREE sections:

**INTRODUCTION (approximately 200-250 words):**
- Introduce the topic clearly with scientific accuracy
- Explain key concepts using examples from the context
- Make it engaging and educational for biology students

**LEARNING PATHWAYS (3 recommendations):**
Suggest 3 specific next topics or areas the student should explore to deepen their understanding:
1. [Topic]: Brief explanation of why this is valuable to learn next
2. [Topic]: Brief explanation of how this builds on the current topic
3. [Topic]: Brief explanation of real-world applications or advanced concepts

**MCQ QUESTION:**
Create 1 multiple-choice question to test understanding of the topic just explained:
Question: [Clear, specific question about the topic]
A) [Option]
B) [Option]
C) [Option]
D) [Option]
Correct Answer: [Letter] - [Brief explanation why this is correct]"""

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
                    {"role": "system", "content": "You are a biology expert and educational guide. Using the provided textbook context, write comprehensive and educational content for biology students."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 1000,
                "top_p": 0.9
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return generate_fallback_response(topic, context)
            
    except Exception as e:
        return generate_fallback_response(topic, context)

def generate_fallback_response(topic, context):
    """Generate a fallback response when Groq API is not available"""
    main_content = context[0] if context else {"content": "General biology information", "chapter": "Biology", "section": "Overview"}
    
    return f"""**INTRODUCTION**

{topic.title()} is an important concept in biology. {main_content['content']} This topic is fundamental to understanding how living organisms function and interact with their environment. Students studying this topic should focus on the key mechanisms and processes involved.

**LEARNING PATHWAYS**

1. Cell Structure: Understanding cellular components will help you grasp how biological processes occur at the molecular level
2. Biochemical Processes: Learning about enzymes and metabolic pathways builds upon the basic concepts introduced here
3. Ecological Relationships: Exploring how organisms interact in ecosystems provides real-world context for these biological principles

**MCQ QUESTION**

Question: What is a key characteristic of the biological process described in {topic}?
A) It only occurs in plant cells
B) It requires specific molecular components and conditions
C) It happens without any energy input
D) It is the same in all living organisms
Correct Answer: B - Biological processes typically require specific molecular components and optimal conditions to function properly."""

def main():
    if len(sys.argv) < 2:
        print("🤖 Answer: Please provide a biology topic to explore!")
        return
    
    topic = sys.argv[1].strip()
    start_time = time.time()
    
    print(f"🔍 Searching for: {topic}")
    
    # Find relevant content
    relevant_content = find_relevant_content(topic)
    
    # Generate response
    response = generate_response_with_groq(topic, relevant_content)
    
    # Format output
    print(f"🤖 Answer:")
    print(response)
    print(f"\n📚 Sources:")
    for i, content in enumerate(relevant_content, 1):
        print(f"{i}. Chapter: {content['chapter']} | Section: {content['section']}")
    
    response_time = (time.time() - start_time) * 1000
    print(f"\n⏱️  Response time: {response_time:.0f}ms")

if __name__ == "__main__":
    main()
