"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withRateLimit } from "@/lib/utils/ai-rate-limiter";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-pro-preview-03-25",
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 2048,
  }
});

export async function generateQuiz() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
      experience: true,
    },
  });

  if (!user) throw new Error("User not found");

  const systemPrompt = `You are an expert technical interviewer and industry professional with deep knowledge of ${user.industry}. 
You specialize in creating challenging but fair technical assessments that test both theoretical knowledge and practical application.

Your task is to generate interview questions that:
1. Match the candidate's industry and experience level
2. Cover both fundamental concepts and advanced topics
3. Include real-world scenarios and problem-solving
4. Are clear, unambiguous, and technically accurate
5. Have clearly correct answers with detailed explanations

If you cannot generate appropriate questions, explain why and what information is needed.`;

  const userPrompt = `Generate 10 technical interview questions for a ${user.industry} professional with ${user.experience || 'varying'} years of experience${
    user.skills?.length ? ` and expertise in ${user.skills.join(", ")}` : ""
  }.

Requirements for questions:
- Mix of theoretical knowledge and practical application
- Include scenario-based questions
- Cover both fundamentals and advanced topics
- Each question should have 4 distinct options
- Include detailed explanations for correct answers
- Ensure questions are current and industry-relevant
- Avoid outdated technologies or deprecated practices

Return the response in this JSON format only:
{
  "questions": [
    {
      "question": "string",
      "context": "string", // Brief context or scenario if applicable
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string",
      "difficulty": "string", // "Basic", "Intermediate", or "Advanced"
      "topic": "string" // Main topic or skill being tested
    }
  ]
}`;

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
    
    const text = result.response.text();
    let cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    
    try {
      const quiz = JSON.parse(cleanedText);
      
      // Validate response structure
      if (!quiz.questions || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
        throw new Error("Invalid question format received");
      }

      // Validate each question
      quiz.questions = quiz.questions.map(q => ({
        ...q,
        options: q.options || [],
        explanation: q.explanation || "No explanation provided",
        difficulty: q.difficulty || "Intermediate",
        topic: q.topic || "General"
      }));

      return quiz.questions;
    } catch (parseError) {
      console.error("Error parsing quiz response:", parseError);
      throw new Error("Failed to parse quiz questions");
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error(error.message || "Failed to generate quiz questions");
  }
}

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
    topic: q.topic,
    difficulty: q.difficulty
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const systemPrompt = `You are an expert career coach and technical mentor specializing in ${user.industry}.
Your role is to provide constructive, encouraging feedback that helps professionals improve their skills.
Focus on growth opportunities and specific learning recommendations.`;

    const wrongQuestionsAnalysis = wrongAnswers
      .map(q => ({
        topic: q.topic,
        difficulty: q.difficulty,
        question: q.question,
        correctAnswer: q.answer,
        userAnswer: q.userAnswer
      }));

    const userPrompt = `Based on the user's quiz performance, provide targeted improvement advice.

Performance Analysis:
${JSON.stringify(wrongQuestionsAnalysis, null, 2)}

Requirements for feedback:
1. Identify key skill gaps based on wrong answers
2. Suggest specific resources or learning paths
3. Keep feedback encouraging and growth-focused
4. Provide 2-3 actionable steps for improvement
5. Focus on patterns in missed questions
6. Include both quick wins and long-term development

Keep the response under 3 sentences and make it specific and actionable.`;

    try {
      const tipResult = await withRateLimit(async () => {
        const response = await model.generateContent([
          { role: "system", parts: [{ text: systemPrompt }]},
          { role: "user", parts: [{ text: userPrompt }]}
        ]);
        return response;
      });

      improvementTip = tipResult.response.text().trim();
      console.log("Generated improvement tip:", improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
