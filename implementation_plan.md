# Implementation Plan - Real LLM Integration

## Goal
Connect the Quiz Generator to a real LLM service (OpenAI) via a secure server-side API route.

## Proposed Changes

### Dependencies
- Install `openai` package.

### API Routes
#### [NEW] [Quiz API Route](file:///c:/Users/Lorry/.gemini/antigravity/scratch/ee-teaching-platform/src/app/api/llm/quiz/route.ts)
- Handles POST requests with `topic`.
- Calls OpenAI API to generate a quiz in JSON format.
- Returns the quiz data.

### Lib
#### [MODIFY] [llm-service.ts](file:///c:/Users/Lorry/.gemini/antigravity/scratch/ee-teaching-platform/src/lib/llm-service.ts)
- Update `generateQuiz` to fetch from `/api/llm/quiz`.

## Verification Plan
- Add `OPENAI_API_KEY` to `.env.local`.
- Navigate to `/test-quiz`.
- Generate a quiz and verify it's not the mock data.
