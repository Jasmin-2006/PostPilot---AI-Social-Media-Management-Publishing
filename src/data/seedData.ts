import { Post, SocialAccount, User, IdeaSuggestion } from '../types';

export const INITIAL_USER: User = {
  id: 'usr_alex_01',
  name: 'Alex Rivera',
  email: 'alex.rivera@postpilot.app',
  avatarUrl: '/src/assets/images/avatar_creator_alex_1790790955557.jpg',
  bio: 'Design lead & creator building intentional digital products. Sharing workflows, AI architecture, and craft.',
  role: 'Founder & Creator',
  preferences: {
    defaultTone: 'Professional',
    defaultLength: 'Medium',
    hashtagCount: 4,
    useEmojis: true,
    theme: 'light',
    emailNotifications: true,
    scheduledAlerts: true,
    failedPublishAlerts: true,
  },
  createdAt: '2026-01-15T09:00:00.000Z',
};

export const DEMO_USERS: User[] = [
  INITIAL_USER,
  {
    id: 'usr_elena_02',
    name: 'Elena Vance',
    email: 'elena@growthcollective.co',
    avatarUrl: '/src/assets/images/avatar_creator_alex_1790790955557.jpg',
    bio: 'Brand strategist & writer. Helping boutique studios launch high-impact narrative campaigns.',
    role: 'Growth Strategist',
    preferences: {
      defaultTone: 'Creative',
      defaultLength: 'Long',
      hashtagCount: 5,
      useEmojis: true,
      theme: 'light',
      emailNotifications: true,
      scheduledAlerts: true,
      failedPublishAlerts: true,
    },
    createdAt: '2026-02-01T14:30:00.000Z',
  }
];

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc_ig',
    platform: 'instagram',
    platformName: 'Instagram',
    isConnected: true,
    accountHandle: '@alexrivera.design',
    accountName: 'Alex Rivera · Design Studio',
    followersCount: 14200,
    connectedAt: '2026-01-20T10:00:00.000Z',
    scope: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    statusMessage: 'Connected via Meta Graph API v19.0',
  },
  {
    id: 'acc_li',
    platform: 'linkedin',
    platformName: 'LinkedIn',
    isConnected: true,
    accountHandle: 'in/alex-rivera-craft',
    accountName: 'Alex Rivera',
    followersCount: 8940,
    connectedAt: '2026-01-20T10:05:00.000Z',
    scope: ['w_member_social', 'r_liteprofile', 'r_emailaddress'],
    statusMessage: 'Connected via LinkedIn Community Management API',
  },
  {
    id: 'acc_tw',
    platform: 'twitter',
    platformName: 'X (Twitter)',
    isConnected: true,
    accountHandle: '@alexcreates',
    accountName: 'Alex Rivera ⚡️',
    followersCount: 22600,
    connectedAt: '2026-01-21T08:30:00.000Z',
    scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    statusMessage: 'Connected via Twitter API v2 (OAuth 2.0 PKCE)',
  },
  {
    id: 'acc_fb',
    platform: 'facebook',
    platformName: 'Facebook Page',
    isConnected: true,
    accountHandle: 'PostPilot Studios',
    accountName: 'PostPilot Official Page',
    followersCount: 5120,
    connectedAt: '2026-02-05T12:00:00.000Z',
    scope: ['pages_manage_posts', 'pages_read_engagement'],
    statusMessage: 'Connected via Facebook Pages API',
  },
  {
    id: 'acc_yt',
    platform: 'youtube',
    platformName: 'YouTube',
    isConnected: false,
    accountHandle: 'Not connected',
    accountName: 'Alex Rivera Studio',
    followersCount: 0,
    statusMessage: 'OAuth 2.0 authorization pending for youtube.upload',
  },
  {
    id: 'acc_th',
    platform: 'threads',
    platformName: 'Threads',
    isConnected: true,
    accountHandle: '@alexrivera.design',
    accountName: 'Alex Rivera',
    followersCount: 6800,
    connectedAt: '2026-02-10T16:45:00.000Z',
    scope: ['threads_basic', 'threads_content_publish'],
    statusMessage: 'Connected via Threads API v1.0',
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post_01',
    userId: 'usr_alex_01',
    title: 'AI Travel Planner Project Launch',
    originalContent: 'I built an AI Travel Planner using React and Gemini. It automates 3-day itinerary generation with maps and budget calculations in under 5 seconds.',
    mediaUrl: '/src/assets/images/sample_post_design_1790790966824.jpg',
    mediaType: 'image',
    link: 'https://github.com/postpilot/travel-planner',
    createdAt: '2026-09-28T14:20:00.000Z',
    updatedAt: '2026-09-28T15:00:00.000Z',
    overallStatus: 'Published',
    publishedAt: '2026-09-28T15:00:00.000Z',
    selectedPlatforms: ['instagram', 'linkedin', 'twitter', 'facebook', 'threads'],
    platforms: {
      instagram: {
        platform: 'instagram',
        caption: `✨ 48 hours of prototyping turned into our smoothest tool yet: the AI Travel Planner.\n\nBuilt with React & Gemini, it generates comprehensive day-by-day itineraries, complete with transit routes and cost benchmarks in under 5 seconds.\n\nSwipe through to see the interactive timeline view. Which city would you test this on first? 👇`,
        hashtags: ['#BuildInPublic', '#ReactJS', '#GeminiAPI', '#ProductDesign', '#WebDev', '#IndieHacker'],
        visualSuggestion: 'Carousel showcasing architecture diagram and real trip card UI on clean phone mockup.',
        status: 'Published',
        publishedAt: '2026-09-28T15:00:00.000Z',
        platformPostId: 'ig_9482910384',
        platformUrl: 'https://instagram.com/p/ig_9482910384'
      },
      linkedin: {
        platform: 'linkedin',
        caption: `Building practical AI utilities doesn't require months of bloat. It requires clarity on user friction.\n\nOver the weekend, I shipped an AI Travel Planner powered by Gemini and React. Here are 3 engineering decisions that made the UX feel instantaneous:\n\n1. Structured Output Schema: Eliminating regex parsing errors completely.\n2. Optimistic UI: Pre-rendering route skeletons while coordinates compute.\n3. Zero-Pill Visual Restraint: Prioritizing legibility over decorative clutter.\n\nWhat is your team's favorite pattern for handling GenAI latency in production?`,
        hashtags: ['#SoftwareEngineering', '#FullStack', '#AIProduct', '#UserExperience'],
        visualSuggestion: 'High-contrast system architecture diagram with clean typographic annotation.',
        status: 'Published',
        publishedAt: '2026-09-28T15:00:00.000Z',
        platformPostId: 'li_2093847291',
        platformUrl: 'https://linkedin.com/feed/update/urn:li:activity:2093847291'
      },
      twitter: {
        platform: 'twitter',
        caption: `Shipped: An AI Travel Planner that generates complete 3-day itineraries in under 5 seconds ⚡️\n\n• React + Gemini\n• Real transit & budget breakdown\n• Clean spatial timeline\n\nLive demo in thread 🧵👇`,
        hashtags: ['#buildinpublic', '#reactjs', '#gemini'],
        visualSuggestion: 'Crisp 16:9 UI screenshot showing the destination planner.',
        status: 'Published',
        publishedAt: '2026-09-28T15:00:00.000Z',
        platformPostId: 'tw_18372948271',
        platformUrl: 'https://x.com/alexcreates/status/18372948271'
      },
      facebook: {
        platform: 'facebook',
        caption: `Excited to unveil our latest weekend project: The AI Travel Planner! ✈️\n\nIf you've ever spent 4 hours bouncing between 15 open tabs trying to plan a short getaway, this tool compiles custom schedules, budgets, and local food spots in seconds. Check out the link below!`,
        hashtags: ['#TravelTech', '#Productivity', '#SideProject'],
        visualSuggestion: 'Editorial image of workspace with travel planning map.',
        status: 'Published',
        publishedAt: '2026-09-28T15:00:00.000Z',
        platformPostId: 'fb_8492019482',
        platformUrl: 'https://facebook.com/postpilot/posts/8492019482'
      },
      threads: {
        platform: 'threads',
        caption: `Built an AI Travel Planner using React & Gemini over the weekend.\n\nThe hardest part wasn't the AI—it was keeping the UI minimal so you don't feel overwhelmed by 50 recommendations at once. Simplicity wins.`,
        hashtags: ['#buildinpublic', '#design'],
        visualSuggestion: 'Minimal quote card or candid desktop snap.',
        status: 'Published',
        publishedAt: '2026-09-28T15:00:00.000Z',
        platformPostId: 'th_0192847291',
        platformUrl: 'https://threads.net/@alexrivera.design/post/th_0192847291'
      }
    }
  },
  {
    id: 'post_02',
    userId: 'usr_alex_01',
    title: 'The Modern Creator Workspace Guide',
    originalContent: 'How we set up a distraction-free physical and digital workspace for multi-channel publishing without burnout.',
    mediaUrl: '/src/assets/images/hero_workspace_laptop_1790790941869.jpg',
    mediaType: 'image',
    createdAt: '2026-09-29T11:15:00.000Z',
    updatedAt: '2026-09-29T11:30:00.000Z',
    overallStatus: 'Scheduled',
    scheduledAt: '2026-10-02T16:30:00.000Z',
    selectedPlatforms: ['instagram', 'youtube', 'facebook'],
    platforms: {
      instagram: {
        platform: 'instagram',
        caption: `🌿 Intentional workspaces breed intentional output.\n\nFor years, I had 80 browser tabs open across 4 screens. Transitioning to a single high-resolution workspace with scheduled distribution windows cut our daily context-switching by half.\n\nSave this post for your weekend desk reset. Details in carousel 📸`,
        hashtags: ['#WorkspaceGoals', '#MinimalDeskSetup', '#CreativeSpace', '#ProductivityHacks'],
        visualSuggestion: 'Warm daylight editorial photograph of desk with minimal accessories.',
        status: 'Scheduled',
        scheduledAt: '2026-10-02T16:30:00.000Z'
      },
      youtube: {
        platform: 'youtube',
        title: 'How I Built a Distraction-Free Workspace for Multi-Platform Publishing',
        caption: `In this walkthrough, we examine how physical architecture and digital pipelines unite to enable high-volume publishing without fatigue.\n\nChapters:\n0:00 - The Context Switching Trap\n02:15 - Physical Ergonomics & Lighting\n05:40 - The "Create Once" Philosophy\n09:10 - PostPilot Pipeline Tour\n13:00 - Key Takeaways\n\nGear & links in pinned comment.`,
        hashtags: ['#WorkspaceTour', '#Productivity'],
        tags: ['workspace tour', 'desk setup 2026', 'minimalist productivity', 'social media workflow', 'creator studio'],
        visualSuggestion: 'Cinematic wide angle thumbnail with warm serif title overlay.',
        status: 'Scheduled',
        scheduledAt: '2026-10-02T16:30:00.000Z'
      },
      facebook: {
        platform: 'facebook',
        caption: `Does your physical workspace support deep work or distract from it? ☕️ We put together our complete guide to setting up a calming, efficient desk that saves hours every week. Drops Friday at 4:30 PM!`,
        hashtags: ['#WorkspaceInspiration', '#Productivity'],
        visualSuggestion: 'Clean lifestyle photo of workspace corner.',
        status: 'Scheduled',
        scheduledAt: '2026-10-02T16:30:00.000Z'
      }
    }
  },
  {
    id: 'post_03',
    userId: 'usr_alex_01',
    title: '5 Design Principles for Content in 2026',
    originalContent: 'Why zero-pill metadata discipline, typographic hierarchy, and anti-slop visual restraint resonate 10x more than generic AI templates.',
    mediaUrl: '/src/assets/images/sample_post_design_1790790966824.jpg',
    mediaType: 'image',
    createdAt: '2026-09-30T09:00:00.000Z',
    updatedAt: '2026-09-30T09:45:00.000Z',
    overallStatus: 'Draft',
    selectedPlatforms: ['linkedin', 'twitter', 'threads'],
    platforms: {
      linkedin: {
        platform: 'linkedin',
        caption: `Audiences are exhausted by generic templates and formulaic copywriting.\n\nIf you want your technical or brand content to stand out this year, consider these 5 editorial design principles:\n\n1. Replace badge enclosures with unboxed text and typographic separators (·)\n2. Limit font scales to 2 deliberate typefaces with tabular figures\n3. Provide single-elevation spatial depth instead of cards inside cards\n4. Lead with proof adjacency rather than vague vanity metrics\n5. Write for readers who value depth over surface-level hustle jargon\n\nWhich of these resonates most with your current brand identity?`,
        hashtags: ['#DesignSystems', '#ContentCraft', '#BrandStrategy', '#Typography'],
        visualSuggestion: 'Slide carousel comparing before/after typography layouts.',
        status: 'Draft'
      },
      twitter: {
        platform: 'twitter',
        caption: `Why most brand content feels invisible in 2026:\n\n• Over-reliance on generic AI templates\n• Cluttered badge pills everywhere\n• Zero typographic hierarchy\n\nThe fix: Editorial restraint. Thread dropping soon 🧵`,
        hashtags: ['#design', '#branding'],
        visualSuggestion: 'Minimal typography comparison graphic.',
        status: 'Draft'
      },
      threads: {
        platform: 'threads',
        caption: `Unpopular opinion: If your design needs 5 different brightly colored pills to explain what a post is about, the typography isn't doing its job. Clean type > badges.`,
        hashtags: ['#designthoughts', '#craft'],
        visualSuggestion: 'Subtle text graphic on warm paper texture.',
        status: 'Draft'
      }
    }
  }
];

export const INITIAL_IDEAS: IdeaSuggestion[] = [
  {
    id: 'idea_seed_1',
    category: 'AI / Machine Learning',
    title: '5 AI Project Architecture Decisions We Regretted (And Fixed)',
    hook: 'The biggest mistake in generative AI tooling isn\'t the model—it\'s treating latency as an afterthought.',
    targetPlatforms: ['linkedin', 'twitter'],
    suggestedFormat: 'Technical Breakdown / Carousel'
  },
  {
    id: 'idea_seed_2',
    category: 'AI / Machine Learning',
    title: 'Educational: How Structured JSON Schema Changes LLM Reliability',
    hook: 'Stop wrestling with hallucinated brackets. Here is why responseSchema is a game changer.',
    targetPlatforms: ['twitter', 'youtube', 'threads'],
    suggestedFormat: 'Code Snippet + Thread'
  },
  {
    id: 'idea_seed_3',
    category: 'Creative Craft',
    title: 'The Anti-Slop Visual Manifesto for Modern Creators',
    hook: 'Why authentic editorial photography and restrained typography outperform loud pastel illustrations every time.',
    targetPlatforms: ['instagram', 'linkedin', 'threads'],
    suggestedFormat: 'Editorial Carousel + Essay'
  },
  {
    id: 'idea_seed_4',
    category: 'Productivity & Systems',
    title: 'The "Create Once, Distribute 6x" Content Engine',
    hook: 'How our single-person studio publishes consistently across 6 networks in under 45 minutes a week.',
    targetPlatforms: ['youtube', 'linkedin', 'facebook'],
    suggestedFormat: 'Video Outline + Case Study'
  },
  {
    id: 'idea_seed_5',
    category: 'Career & Growth',
    title: 'From Junior Dev to Leading High-Leverage AI Workflows',
    hook: '3 skills that accelerated my trajectory faster than writing 10,000 lines of boilerplate code.',
    targetPlatforms: ['linkedin', 'threads'],
    suggestedFormat: 'Personal Narrative'
  },
  {
    id: 'idea_seed_6',
    category: 'Tech Showcase',
    title: 'Live Walkthrough: Multi-Platform Social Media Scheduler',
    hook: 'Behind the curtain of how real-time speech recognition and AI adapt captions for each platform.',
    targetPlatforms: ['youtube', 'twitter', 'instagram'],
    suggestedFormat: 'Feature Demo'
  }
];
