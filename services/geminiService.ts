import * as GenAI from "@google/genai";
import type { ServicePricing, BlogPost, SeoContentGraderResult, HoloscanResult, CompetitorSnapshotResult, AdCopyResult, BlogIdea, KeywordCluster, SocialPostResult, NicheProfileResult, ScannerInsight, SocialCampaign, DocumentLineItem, Task, Project, ContactSubmission, SiteDataContextType, User, NewBlogPost, NewArchivedDocument, ContentBriefResult, ClientProspectAnalysisResult, SolutionStep, TechnicalSeoAudit, RoiAnalysis, SocialPlatformAnalysis } from '../types';
import { slugify, SITE_URL } from "../types";

const API_URL = 'http://localhost:3001/api/genai';

async function generate(model: string, prompt: any, config?: any): Promise<any> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      generationConfig: config,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}


// --- AI Toolkit Functions ---

export async function* generateDigitalStrategy(businessIdea: string): AsyncGenerator<string, void, unknown> {
  const model = 'gemini-2.5-flash';
  const prompt = `You are a world-class digital marketing strategist. Generate a comprehensive digital strategy for the following business idea. Structure the output in markdown format with clear headings (###) and bullet points.

Business Idea: "${businessIdea}"

The strategy should cover:
- Target Audience (with key demographics and psychographics)
- Core Value Proposition
- SEO Strategy (including 3-5 pillar content ideas)
- Content Marketing Strategy (types of content to create)
- Social Media Strategy (platforms and content angles)
- Key Performance Indicators (KPIs) to track success
`;

  const response = await generate(model, prompt);
  for (const part of response.candidates[0].content.parts) {
    yield part.text;
  }
}

export async function analyzeWebsitePresence(url: string): Promise<HoloscanResult> {
  const model = 'gemini-2.5-flash';
  const prompt = `Analyze the website at ${url} and provide a high-level digital presence report. Evaluate it on SEO, User Experience (UX), Performance, and Security. For each category, provide a score from 1-100, a short feedback summary, and one key recommendation. Also provide an overall score and a 2-sentence executive summary.`;
  
  const response = await generate(model, prompt, { responseMimeType: 'application/json' });
  return JSON.parse(response.candidates[0].content.parts[0].text) as HoloscanResult;
}

export async function analyzeCompetitors(yourUrl: string, competitorUrl: string): Promise<CompetitorSnapshotResult> {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze and compare the websites ${yourUrl} (my site) and ${competitorUrl} (competitor). For each site, estimate its monthly traffic (e.g., "10k-50k"), domain authority (0-100), identify its top 5 SEO keywords, and list 3 key strengths. Then, provide a concise "Opportunity Analysis" paragraph suggesting a strategic action I can take to compete.`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as CompetitorSnapshotResult;
}

export async function generateAdCopy(productName: string, targetAudience: string, keyFeatures: string, tone: string): Promise<AdCopyResult> {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate ad copy for a product.
    - Product Name: ${productName}
    - Target Audience: ${targetAudience}
    - Key Features/Benefits: ${keyFeatures}
    - Tone of Voice: ${tone}
    
    Provide 3 compelling headlines (under 40 characters) and 2 compelling descriptions (under 150 characters).`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as AdCopyResult;
}

export async function generateBlogIdeas(topic: string): Promise<BlogIdea[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate 5 creative, SEO-friendly blog post ideas for the topic: "${topic}". For each idea, provide a catchy title, a 1-sentence hook to draw the reader in, and 3-5 relevant keywords.`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as BlogIdea[];
}

export async function generateKeywordClusters(seedKeyword: string): Promise<KeywordCluster[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate 5 relevant keyword clusters based on the seed keyword "${seedKeyword}". For each cluster, provide a descriptive title and a list of 5-7 related long-tail keywords.`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as KeywordCluster[];
}

export async function generateSocialPosts(topic: string, platform: string, goal: string, tone: string): Promise<SocialPostResult[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate 2 social media post variations.
    - Topic/URL/Content: ${topic}
    - Platform: ${platform}
    - Goal: ${goal}
    - Tone: ${tone}

    For each variation, provide the post copy, a list of 3-5 relevant hashtags (without the #), and a creative visual suggestion (e.g., "A short animated GIF of...").`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as SocialPostResult[];
}

export async function gradeSeoContent(content: string, keyword: string): Promise<SeoContentGraderResult> {
    const model = 'gemini-2.5-flash';
    const prompt = `Analyze the following content for its SEO effectiveness for the target keyword "${keyword}". Evaluate it on these four pillars:
    1. Keyword Optimization: Use of keyword and variations in title, headings, content.
    2. Readability & Structure: Sentence length, paragraph structure, use of lists/headings.
    3. Semantic SEO: Inclusion of related entities and concepts.
    4. Expertise & Trust (E-E-A-T): Depth of information, confident language.
    
    Provide a score from 1-100 for each pillar, and a list of 2-3 bullet points of actionable feedback for each. Also provide an overall score and a 1-2 sentence executive summary.
    
    Content:
    ---
    ${content}
    ---
    `;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as SeoContentGraderResult;
}

export async function generateNicheProfile(industry: string, skills: string, audience: string): Promise<NicheProfileResult> {
    const model = 'gemini-2.5-flash';
    const prompt = `Based on the following inputs, define a profitable and specific market niche.
    - Passion/Industry: ${industry}
    - My Skills: ${skills}
    - Target Audience: ${audience}

    Provide a niche name, a short description, a more defined target audience, a unique selling proposition (USP), 3-5 potential content angles, and 5-7 relevant SEO keywords.`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as NicheProfileResult;
}

export async function generateArticleOutline(topic: string): Promise<string[]> {
    const model = 'gemini-2.5-flash';
    const prompt = `Generate a concise, SEO-friendly blog post outline for the topic: "${topic}". Provide a list of 5-7 key headings (H2s and H3s) that would form a logical structure for a comprehensive article.`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    const result = JSON.parse(response.candidates[0].content.parts[0].text);
    return result.outline as string[];
}

export async function* generateArticleDraft(topic: string, outline: string[]): AsyncGenerator<string, void, unknown> {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert SEO content writer. Write a comprehensive, well-structured blog post on the topic "${topic}".
    Use the following outline:
    ${outline.map(item => `- ${item}`).join('\n')}

    Write in a clear, engaging, and informative tone. Use markdown for formatting (### for H3 headings, **** for bold, etc.). The article should be at least 800 words long.`;
    
    const response = await generate(model, prompt);
    for (const part of response.candidates[0].content.parts) {
        yield part.text;
    }
}

export async function generateContentBrief(topic: string, otherPosts: {slug: string, title: string}[]): Promise<ContentBriefResult> {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert SEO content strategist. Create a comprehensive content brief for an article on the topic: "${topic}".

Analyze the topic to determine the primary search intent.
Define a specific target audience for this content.
Suggest a compelling, SEO-friendly title.
Generate a logical structure with key H2 and H3 headings.
List 10-15 semantically related keywords and LSI terms (not just variations of the main topic).
Analyze the top 3 ranking articles for this topic and provide a one-sentence summary of each of their key strengths.
Suggest 3-4 internal linking opportunities from this new article to the following existing blog posts on our site.

Existing posts:
${otherPosts.map(p => `- Title: ${p.title} (URL: ${SITE_URL}/blog/${p.slug})`).join('\n')}
`;

    const response = await generate(model, prompt, { responseMimeType: 'application/json' });

    return JSON.parse(response.candidates[0].content.parts[0].text) as ContentBriefResult;
}

// FIX: Define and export missing types for prospect analysis.
export interface IdealCustomerProfile {
  industry: string;
  location: string;
  keywords: string;
}

export interface FoundProspect {
  companyName: string;
  websiteUrl: string;
}

// FIX: Add findProspects function. This is a mocked implementation for demonstration.
export const findProspects = async (icp: IdealCustomerProfile): Promise<FoundProspect[]> => {
  console.log("Simulating finding prospects for:", icp);
  // In a real application, this would use a third-party API like Apollo.io or a web scraper.
  // For this mock, we'll return some dummy data.
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (icp.industry.toLowerCase().includes('saas')) {
    return [
      { companyName: 'Innovate SaaS', websiteUrl: 'https://www.innovatesaas.com' },
      { companyName: 'CloudCore Solutions', websiteUrl: 'https://www.cloudcore.com' },
    ];
  }
  return [{ companyName: 'Generic Biz Inc.', websiteUrl: 'https://www.genericbiz.com' }];
};

// FIX: Add analyzeClientProspect function. This uses the Gemini API.
export const analyzeClientProspect = async (
  url: string,
  description: string | null,
  socialUrls: { linkedIn?: string; twitter?: string; instagram?: string; facebook?: string; }
): Promise<ClientProspectAnalysisResult> => {
  const model = 'gemini-2.5-flash';
  const prompt = `
    You are an expert Digital Marketing Agency strategist. Analyze the business at ${url} to create a comprehensive client prospect report for our agency.
    Business Description (if provided): ${description || 'Not provided. Analyze from website content.'}
    Social Media Links:
    - LinkedIn: ${socialUrls.linkedIn || 'N/A'}
    - Twitter/X: ${socialUrls.twitter || 'N/A'}
    - Instagram: ${socialUrls.instagram || 'N/A'}
    - Facebook: ${socialUrls.facebook || 'N/A'}
    
    Your analysis must be deep, insightful, and actionable.
    For the social presence analysis, be extremely detailed and accurate. For each platform provided, provide an overall score from 0-100. Estimate follower count and posting frequency. Analyze their content strategy, including content pillars and formats. Analyze their audience engagement, including comment-to-like ratio and community interaction. Then, provide separate, bulleted lists for their key strengths, key weaknesses, and actionable recommendations.
    Identify their technology stack, critique their value proposition, and suggest concrete quick wins.
    Perform a deep technical SEO audit covering Core Web Vitals, mobile-friendliness, schema markup, site speed, security, and crawlability.
    For the solution roadmap, provide a detailed, phase-by-phase plan. Each phase must include a timeline, key activities, and the specific KPIs that will be used to track success.
    Based on your proposed solution roadmap, generate a high-level ROI analysis, including projected impact, key assumptions, estimated ROI percentage, and a timeline for seeing results.
    Generate a detailed report based on the provided JSON schema.
  `;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text) as ClientProspectAnalysisResult;
}




// --- General Purpose & Admin Functions ---

export const startStrategistChat = (agencyData: string) => {
    const genAI = new GenAI.GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: `You are "The Strategist," an AI business partner for the Prevaledge digital marketing agency. You have access to real-time agency data. Your role is to provide strategic insights, answer questions, and execute commands to help run the agency efficiently. You are professional, data-driven, and proactive.

You have access to the following tools:
- create_project
- create_task
- assign_task
- update_task_status
- get_tasks_by_status
- find_user_by_name
- get_project_by_name
- generate_seo_report
- forecast_revenue

When a user asks for an action, use the appropriate tool. When asked for information, use the provided agency data context.

Agency Data Context:
---
${agencyData}
---
`,
    });
    return model.startChat({
        tools: [/* Tool definitions would be included here in a real implementation */],
        history: [],
    });
};

export async function generateMorningBriefing(tasks: Task[], projects: Project[], submissions: ContactSubmission[]): Promise<string> {
    const model = 'gemini-2.5-flash';
    const today = new Date().toLocaleDateString();

    const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done');
    const upcomingTasks = tasks.filter(t => {
        const dueDate = new Date(t.dueDate);
        const now = new Date();
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(now.getDate() + 3);
        return dueDate >= now && dueDate <= threeDaysFromNow && t.status !== 'Done';
    });

    const newSubmissions = submissions.filter(s => {
        const subDate = new Date(s.submittedAt);
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        return subDate > twentyFourHoursAgo;
    });

    const prompt = `
You are an expert executive assistant AI for a digital marketing agency. 
Generate a concise, actionable morning briefing for the agency's manager for ${today}.
Use markdown for clear formatting. Start with "### Morning Briefing".

Here's the data:
- Overdue Tasks: ${overdueTasks.length}
- Upcoming Task Deadlines (Next 3 Days): ${upcomingTasks.length}
- New Contact Submissions (Last 24h): ${newSubmissions.length}
- Active Projects: ${projects.filter(p => p.status === 'In Progress').length}

1.  **Priority Alert**: Summarize the most critical items. Mention the number of overdue tasks first if any exist. Highlight the number of new client inquiries.

2.  **Upcoming Deadlines**: List up to 3 tasks with the nearest due dates. For each, list: "- [Task Title] for [Project Name] - Due: [Due Date]".

3.  **New Inquiries**: Briefly mention the names of the people who submitted new contact forms in the last 24 hours.

4.  **Project Pulse**: Give a one-sentence summary of the overall project status, mentioning the number of active projects.

Keep the entire briefing under 150 words. Be professional, concise, and helpful.
`;

    const response = await generate(model, prompt);
    return response.candidates[0].content.parts[0].text;
}


export async function generateQuoteItemsFromPrompt(prompt: string, servicePricingData: ServicePricing[]): Promise<Omit<DocumentLineItem, 'id'>[]> {
    const model = 'gemini-2.5-flash';
    const systemPrompt = `You are a sales assistant for a digital marketing agency. Your task is to convert a user's request into a structured list of line items for a quote based on the services we offer.

Today's Date: ${new Date().toLocaleDateString()}

AVAILABLE SERVICES:
---
${servicePricingData.map(service => `
- Service ID: ${service.id}
- Name: ${service.name}
- Category: ${service.category}
- Description: ${service.description}
- Price: $${service.price}
- Price Type: ${service.price_type}
- Features: ${service.features.join(', ')}
`).join('')}
---

USER REQUEST: "${prompt}"

Your task:
1.  Analyze the user's request and match it to the available services.
2.  If the user requests a service for a specific duration (e.g., "for 6 months"), set the 'quantity' for that line item accordingly. Default to 1 if not specified.
3.  For one-time services, the quantity should always be 1.
4.  Construct a JSON array of line items based on the "DocumentLineItem" schema provided below.
5.  Do not include services the user did not ask for. If a request is ambiguous, use your best judgment to select the most relevant service.
6.  The 'description' in the output should be the service name. The 'unit_price' should be the service price.

JSON SCHEMA:
[
  {
    "description": "string",
    "quantity": "number",
    "unit_price": "number"
  }
]

Respond ONLY with the raw JSON array. Do not include any other text, markdown, or explanation.
`;

    const response = await generate(model, systemPrompt, { responseMimeType: 'application/json' });
    const result = JSON.parse(response.candidates[0].content.parts[0].text);
    return result as Omit<DocumentLineItem, 'id'>[];
}

export async function analyzeInquiry(message: string): Promise<{ inquiryType: string }> {
  const model = 'gemini-2.5-flash';
  const prompt = `Classify the following client inquiry into one of these categories: "Sales", "Support", "Partnership", "General Inquiry", "Spam".
  Inquiry: "${message}"`;
  
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text);
}

export async function* generateBlogPostDraft(title: string): AsyncGenerator<string, void, unknown> {
  const model = 'gemini-2.5-flash';
  const prompt = `Write a well-researched, SEO-optimized blog post draft with the title "${title}". The draft should be at least 600 words, structured with markdown headings (###), subheadings (####), bullet points, and bold text. Ensure the content is informative and engaging.`;

  const response = await generate(model, prompt);
    for (const part of response.candidates[0].content.parts) {
        yield part.text;
    }
}

export async function* improveText(text: string): AsyncGenerator<string, void, unknown> {
    const model = 'gemini-2.5-flash';
    const prompt = `You are an expert editor. Review the following text and improve its clarity, tone, and flow. Correct any grammatical errors or awkward phrasing, but retain the core meaning. 
    
    Original Text:
    ---
    ${text}
    ---
    
    Improved Text:`;
    const response = await generate(model, prompt);
    for (const part of response.candidates[0].content.parts) {
        yield part.text;
    }
}

export async function generateExcerpt(content: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const prompt = `Summarize the following blog post content into a compelling, one-paragraph excerpt of about 50 words. 
    
    Content:
    ---
    ${content.substring(0, 1500)}...
    ---`;
    const response = await generate(model, prompt);
    return response.candidates[0].content.parts[0].text;
}

export async function generateSeoMetadata(content: string, focusKeyword: string): Promise<{ metaTitle: string, metaDescription: string }> {
    const model = 'gemini-2.5-flash';
    const prompt = `Based on the following content and focus keyword, generate SEO metadata.
    - Focus Keyword: ${focusKeyword}
    - Content: ${content.substring(0, 2000)}...
    
    Provide an SEO-optimized meta title (under 60 characters) and a meta description (under 160 characters).`;
    const response = await generate(model, prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text);
}

export async function generateImageFromPrompt(prompt: string): Promise<string> {
    const model = 'imagen-4.0-generate-001';
    const response = await generate(model, `A high-quality, photorealistic marketing image for a blog post. Clean, modern, professional aesthetic. Subject: ${prompt}`);
    return `data:image/jpeg;base64,${response.candidates[0].content.parts[0].text}`;
}

// --- Chat Functions ---

export async function* startChatStream(message: string): AsyncGenerator<string, void, unknown> {
  const model = 'gemini-2.5-flash';
  const prompt = `You are Edge, an enthusiastic and insightful AI assistant from Prevaledge, a top-tier digital marketing agency. Your personality is curious, helpful, and professional, with a friendly and encouraging tone. Your goal is to make digital marketing accessible and exciting for everyone. You should:
- Answer questions about digital marketing, SEO, AI, and Prevaledge's services.
- Proactively suggest how Prevaledge's services can solve user problems.
- Use simple analogies to explain complex topics.
- Keep your responses clear, well-structured, and easy to understand.
- Use an occasional, appropriate emoji (like 😊, ✨, or 🚀) to add a touch of warmth and personality, but don't overdo it.
- When a user seems unsure, offer to guide them or suggest a question they could ask.

User message: ${message}`;
  
  const response = await generate(model, prompt);
  for (const part of response.candidates[0].content.parts) {
    yield part.text;
  }
}

export const executeFunctionCall = async (name: string, args: any, siteDataContext: SiteDataContextType, currentUser: User | null) => {
    // This function now needs to be implemented on the backend. 
    // The frontend will make a a request to a new endpoint on the backend to execute function calls.
    console.log('Function calling is not implemented in this version.');
    return { error: 'Function calling is not implemented in this version.' };
};

export const connectLiveAdminAgent = async (
    onMessage: (message: any) => void,
    onError: (error: any) => void,
    onClose: () => void,
    agencyData: string
) => {
    console.warn("Live agent is not implemented in this version. Using fallback.");
    // Return a mock session object to prevent crashes
    return {
        close: () => {},
        sendToolResponse: (response: any) => {
            console.log("Attempted to send tool response:", response);
        }
    };
};
