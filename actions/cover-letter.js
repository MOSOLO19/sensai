"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRateLimit } from "@/lib/utils/ai-rate-limiter";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-pro-preview-03-25",
  generationConfig: {
    temperature: 0.8, // Slightly more creative for cover letters
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const systemPrompt = `You are an expert career coach and professional resume writer with deep experience in ${user.industry}.
You excel at crafting compelling cover letters that:
1. Highlight candidates' unique value propositions
2. Align experience with job requirements
3. Demonstrate genuine interest in the role and company
4. Maintain a professional yet engaging tone
5. Follow modern business writing best practices

Your cover letters should be:
- Concise and impactful
- Tailored to the specific role
- Free of clichés and generic statements
- Focused on concrete achievements
- Optimized for both human readers and ATS systems`;

  const userPrompt = `Create a compelling cover letter for a ${data.jobTitle} position at ${data.companyName}.

Candidate Profile:
- Industry: ${user.industry}
- Years of Experience: ${user.experience || 'Not specified'}
- Core Skills: ${user.skills?.join(", ") || 'Various technical skills'}
- Professional Background: ${user.bio || 'Experienced industry professional'}

Job Details:
${data.jobDescription}

Requirements:
1. Structure:
   - Professional business letter format
   - Clear introduction, body, and conclusion
   - 300-400 words maximum

2. Content:
   - Strong opening hook
   - 2-3 relevant achievements
   - Specific company research/knowledge
   - Clear value proposition
   - Strong call to action

3. Style:
   - Professional yet personable tone
   - Active voice
   - Industry-appropriate terminology
   - Concrete examples over generic statements

4. Format:
   - Use markdown formatting
   - Include proper spacing and sections
   - Ensure scannable structure

If any critical information is missing, highlight what additional details would strengthen the letter.`;

  try {
    const result = await withRateLimit(async () => {
      const response = await model.generateContent([
        { role: "system", parts: [{ text: systemPrompt }]},
        { role: "user", parts: [{ text: userPrompt }]}
      ]);

      if (!response.response) {
        throw new Error("Failed to generate response");
      }

      return response;
    });
    
    const content = result.response.text().trim();

    // Validate the generated content
    if (!content || content.length < 100) {
      throw new Error("Generated content is too short or empty");
    }

    // Check for markdown formatting
    if (!content.includes('#') && !content.includes('---')) {
      console.warn("Generated content might lack proper markdown formatting");
    }

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error(error.message || "Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.findUnique({
    where: {
      id,
      userId: user.id,
    },
  });
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  return await db.coverLetter.delete({
    where: {
      id,
      userId: user.id,
    },
  });
}
