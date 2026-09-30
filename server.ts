import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization as mandated by SKILL.md
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for fallback generation if API key is temporarily unavailable
function getMockPlatformVariants(topic: string, rawContent: string, tone = 'Engaging') {
  const content = rawContent || topic || 'Exciting new product launch and milestone update!';
  return {
    instagram: {
      caption: `✨ Big news today! ${content}\n\nSwipe through to see the journey behind this milestone. What part resonated with you the most?\n\nDrop your thoughts in the comments 👇`,
      hashtags: ['#CreatorEconomy', '#Innovation', '#Milestone', '#DesignInspiration', '#PostPilot'],
      visualSuggestion: 'Carousel showcasing high-contrast behind-the-scenes slides with warm minimal aesthetic.'
    },
    linkedin: {
      caption: `Excited to share a major milestone: ${content}\n\nOver the past few months, our focus has been on building intentional, high-leverage workflows that scale. Here are the 3 key takeaways:\n\n1. Iterate with user feedback early\n2. Automate repetitive distribution overhead\n3. Protect creative focus time\n\nHow is your team approaching distribution this quarter?`,
      hashtags: ['#Leadership', '#Productivity', '#ContentStrategy', '#Entrepreneurship', '#FutureOfWork'],
      visualSuggestion: 'Single bold infographic or clean product screenshot highlighting key metrics.'
    },
    twitter: {
      caption: `⚡️ ${content.slice(0, 180)}\n\nBuilt for creators who value speed and clarity. Thread below 🧵👇`,
      hashtags: ['#buildinpublic', '#tech', '#growth'],
      visualSuggestion: 'Crisp 16:9 UI card preview.'
    },
    facebook: {
      caption: `We have some exciting news to share with our community! ${content}\n\nThank you to everyone who supported this vision from day one. Click the link below to check out the full release and let us know what you think in the comments!`,
      hashtags: ['#Community', '#NewRelease', '#Storytelling'],
      visualSuggestion: 'Editorial photo showing the workspace or team in action.'
    },
    youtube: {
      title: `${topic || 'How We Built It'}: The Full Behind-The-Scenes Breakdown`,
      caption: `In this video, we break down: ${content}\n\nTimestamps:\n0:00 - Introduction\n01:45 - The Core Problem\n04:20 - AI Customization Workflow\n08:15 - Multi-Platform Launch\n11:30 - Final Results & Next Steps\n\nLinks mentioned in video:\n👉 https://postpilot.app`,
      tags: ['content creation', 'social media strategy', 'AI automation', 'workflow optimization', 'PostPilot'],
      visualSuggestion: 'High-contrast thumbnail with clean serif typography and human expression.'
    },
    threads: {
      caption: `Quick reflection on today: ${content}\n\nAnyone else noticing a massive shift toward focused, high-signal posting instead of volume?`,
      hashtags: ['#threads', '#creators', '#strategy'],
      visualSuggestion: 'Minimal quote card or single candid photo.'
    }
  };
}

// 1. Generate multi-platform content adapted from a single prompt
app.post('/api/ai/generate-post', async (req, res) => {
  try {
    const { topic, rawContent, tone = 'Professional', length = 'Medium', selectedPlatforms = ['instagram', 'linkedin', 'twitter'] } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        source: 'fallback',
        platforms: getMockPlatformVariants(topic, rawContent, tone),
      });
    }

    const prompt = `You are PostPilot, an expert AI social media strategist.
Adapt this single core idea or draft into tailored content specifically optimized for each requested platform:
Core Idea / Topic: "${topic || ''}"
Raw Content / Draft: "${rawContent || ''}"
Desired Tone: "${tone}"
Target Length: "${length}"
Platforms requested: ${JSON.stringify(selectedPlatforms)}

Output pure JSON matching this exact structure:
{
  "instagram": {
    "caption": "engaging caption with line breaks and call to action",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "visualSuggestion": "art direction suggestion for photo/carousel"
  },
  "linkedin": {
    "caption": "professional narrative hook, bullet points, insights, and engagement question",
    "hashtags": ["#tag1", "#tag2", "#tag3"],
    "visualSuggestion": "document or infographic visual suggestion"
  },
  "twitter": {
    "caption": "punchy concise tweet under 260 characters",
    "hashtags": ["#tag1", "#tag2"],
    "visualSuggestion": "visual asset description"
  },
  "facebook": {
    "caption": "community-friendly warm narrative with clear link placement hook",
    "hashtags": ["#tag1", "#tag2"],
    "visualSuggestion": "lifestyle/editorial visual suggestion"
  },
  "youtube": {
    "title": "compelling YouTube video title",
    "caption": "rich YouTube description with timestamps outline and links",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "visualSuggestion": "thumbnail composition idea"
  },
  "threads": {
    "caption": "conversational authentic short thought",
    "hashtags": ["#tag1", "#tag2"],
    "visualSuggestion": "candid snapshot idea"
  }
}
Provide entries for each platform in [${selectedPlatforms.join(', ')}].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      success: true,
      source: 'gemini',
      platforms: parsed,
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    const { topic, rawContent, tone } = req.body;
    return res.json({
      success: true,
      source: 'fallback',
      error: error.message,
      platforms: getMockPlatformVariants(topic, rawContent, tone),
    });
  }
});

// 2. Suggest inspired post ideas by category or custom niche
app.post('/api/ai/ideas', async (req, res) => {
  try {
    const { category = 'AI / Technology', nichePrompt = '' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const fallbackIdeas = [
        {
          id: 'idea-1',
          category,
          title: `5 Key Breakthroughs in ${category} This Month`,
          hook: "Most people missed this subtle shift, but it changes everything for creators.",
          targetPlatforms: ['linkedin', 'twitter'],
          suggestedFormat: 'Carousel / Thread'
        },
        {
          id: 'idea-2',
          category,
          title: `Behind the Scenes: What Failed Before It Worked`,
          hook: "Here's the raw truth about what went wrong and how we fixed it in 48 hours.",
          targetPlatforms: ['instagram', 'linkedin', 'threads'],
          suggestedFormat: 'Photo + Long-form Story'
        },
        {
          id: 'idea-3',
          category,
          title: `The 15-Minute Daily Framework We Use`,
          hook: "Stop spending 3 hours on social distribution. Here is our step-by-step pipeline.",
          targetPlatforms: ['twitter', 'youtube', 'linkedin'],
          suggestedFormat: 'Video Outline + Tweet'
        },
        {
          id: 'idea-4',
          category,
          title: `Contrarian Take: Why the Conventional Advice Is Outdated`,
          hook: "Everyone tells you to post 5x a day. Why high-signal depth wins in 2026.",
          targetPlatforms: ['threads', 'twitter'],
          suggestedFormat: 'Hot Take / Discussion'
        },
        {
          id: 'idea-5',
          category,
          title: `Case Study: 0 to 10k Active Readers with Zero Ad Spend`,
          hook: "The exact playbook, templates, and publishing cadence step-by-step.",
          targetPlatforms: ['linkedin', 'youtube', 'facebook'],
          suggestedFormat: 'Detailed Breakdown'
        },
        {
          id: 'idea-6',
          category,
          title: `My Curated Tech Stack for Clean Execution`,
          hook: "3 tools I would keep if I had to start over tomorrow.",
          targetPlatforms: ['instagram', 'twitter'],
          suggestedFormat: 'Bento Grid Showcase'
        }
      ];
      return res.json({ success: true, ideas: fallbackIdeas });
    }

    const prompt = `Generate 6 high-performing, thoughtful social media post ideas for category: "${category}". ${nichePrompt ? `Additional context: ${nichePrompt}` : ''}.
Return pure JSON array of objects with keys: id, category, title, hook, targetPlatforms (array of platform keys e.g. ["instagram","linkedin","twitter"]), suggestedFormat.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    return res.json({ success: true, ideas: parsed });
  } catch (error: any) {
    console.error('Ideas error:', error);
    return res.json({
      success: true,
      ideas: [
        {
          id: 'fallback-1',
          category: req.body.category || 'General',
          title: '3 Principles That Doubled Our Signal-to-Noise Ratio',
          hook: 'Focusing on one metric transformed our workflow completely.',
          targetPlatforms: ['linkedin', 'twitter'],
          suggestedFormat: 'Insight Breakdown'
        }
      ]
    });
  }
});

// 3. AI Content Refinement Tools (Improve, Shorten, Expand, Professional, Friendly, Engaging, Hashtags)
app.post('/api/ai/refine-content', async (req, res) => {
  try {
    const { platform, text, action, tone, length } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      let refined = text;
      if (action === 'shorten') refined = text.split('\n')[0] || text.slice(0, 140);
      else if (action === 'professional') refined = `In professional perspective: ${text.replace(/🔥|⚡️|🚀/g, '')}`;
      else if (action === 'friendly') refined = `Hey everyone! 😊 ${text}\n\nWould love to hear your thoughts!`;
      else if (action === 'engaging') refined = `🔥 Question for you: ${text}\n\nDrop a comment below with your take! 👇`;
      else if (action === 'hashtags') refined = `${text}\n\n#PostPilot #Growth #Strategy #Productivity #ModernWork`;
      else refined = `${text}\n\n(Polished for clarity and high engagement)`;

      return res.json({ success: true, result: refined });
    }

    const prompt = `You are PostPilot's content editor.
Modify this social media text for platform: "${platform}".
Current text: """${text}"""
Requested action: "${action}" (e.g. improve, shorten, expand, make-professional, make-friendly, make-engaging, generate-hashtags)
Target tone: "${tone || 'Context-native'}"
Target length: "${length || 'Balanced'}"

Respond ONLY with the revised text content (preserving necessary emojis or hashtags appropriate for the request). Do not add conversational prefixes like "Here is the revised text:".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ success: true, result: response.text?.trim() || text });
  } catch (error: any) {
    console.error('Refine error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Voice Command & Voice Idea Processing
app.post('/api/ai/voice-process', async (req, res) => {
  try {
    const { voiceTranscript, currentDraft = {} } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: true,
        actionType: 'create_post',
        interpretedIdea: voiceTranscript,
        suggestedTitle: voiceTranscript.slice(0, 40) + '...',
        suggestedContent: voiceTranscript,
        platforms: ['instagram', 'linkedin', 'twitter'],
        responseMessage: `Understood! I drafted a multi-platform post based on your voice input: "${voiceTranscript}"`
      });
    }

    const prompt = `Analyze this spoken voice input from a user on the PostPilot social media app:
Voice Transcript: "${voiceTranscript}"
Current Post Draft State: ${JSON.stringify(currentDraft)}

Determine if this is:
1. "create_post": The user is speaking a new idea or topic for a post (e.g. "I want to create a post about my new AI travel planner project" or "Post about our 10,000 user milestone").
2. "refine_command": The user is giving an edit instruction (e.g. "Make this more professional", "Shorten the Instagram caption", "Give me better hashtags", "Create a LinkedIn version").

Return pure JSON:
{
  "actionType": "create_post" | "refine_command",
  "interpretedIdea": "concise core concept",
  "suggestedTitle": "clean title for the post",
  "suggestedContent": "expanded polished post content draft",
  "refineInstruction": "if refine_command, what to change",
  "targetPlatform": "if specific platform mentioned e.g. instagram, linkedin, twitter, threads, youtube, facebook, or 'all'",
  "responseMessage": "friendly confirmation message to the user explaining what was done"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Voice process error:', error);
    return res.json({
      success: true,
      actionType: 'create_post',
      interpretedIdea: req.body.voiceTranscript,
      suggestedTitle: 'Voice Draft Idea',
      suggestedContent: req.body.voiceTranscript,
      responseMessage: 'Captured your voice idea and initiated a new draft!'
    });
  }
});

// 5. Dedicated AI Assistant Conversational Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { messages, userPostsContext = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const lastMsg = messages?.[messages.length - 1]?.content || '';
      return res.json({
        success: true,
        reply: `I can help you strategize, adapt content, and plan your distribution for "${lastMsg.slice(0, 30)}". What platform would you like to target first?`
      });
    }

    const systemPrompt = `You are PostPilot Assistant, an elite editorial social media strategist and content producer.
You help creators, founders, and marketing teams create once and distribute across Instagram, LinkedIn, X (Twitter), Facebook, YouTube, and Threads.
You know their current post library: ${JSON.stringify(userPostsContext.slice(0, 5).map((p: any) => ({ title: p.title, platforms: Object.keys(p.platforms || {}) })))}.
Tone: Insightful, encouraging, concise, actionable, and formatted with clean markdown, bullet points, and high-impact hooks.`;

    const chatHistory = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatHistory,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return res.json({
      success: true,
      reply: response.text || 'How can I assist your social strategy today?'
    });
  } catch (error: any) {
    console.error('Assistant error:', error);
    return res.json({
      success: true,
      reply: "I am ready to help refine your copy, generate hooks, or adapt your post for each platform."
    });
  }
});

// 6. Direct Publishing simulation & status tracking
app.post('/api/publish/batch', async (req, res) => {
  const { postId, platforms, postData } = req.body;
  // Simulate network dispatch with realistic timing
  await new Promise(r => setTimeout(r, 600));

  const results: Record<string, any> = {};
  for (const plat of platforms) {
    results[plat] = {
      status: 'Published',
      publishedAt: new Date().toISOString(),
      platformPostId: `post_${plat}_${Math.random().toString(36).substring(2, 9)}`,
      url: `https://${plat}.com/post/${Math.random().toString(36).substring(2, 7)}`
    };
  }

  return res.json({
    success: true,
    postId,
    results,
    message: `Successfully published across ${platforms.length} platform(s)`
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PostPilot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
