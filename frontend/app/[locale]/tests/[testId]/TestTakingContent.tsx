'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Test, Question, LocalizedText } from '@/types/test';
import { submitQuizResult } from '@/lib/api/tests';

interface TestTakingContentProps {
  quiz: Test;
  questions: Question[];
  locale: string;
}

// Helper function to get localized text
function getLocalizedText(text: LocalizedText, locale: string): string {
  if (typeof text === 'string') return text;
  return text[locale as keyof typeof text] || text.en || '';
}

// Group questions into sections (6 questions per section)
function groupQuestionsIntoSections(questions: Question[], questionsPerSection: number = 6) {
  const sections = [];
  for (let i = 0; i < questions.length; i += questionsPerSection) {
    sections.push(questions.slice(i, i + questionsPerSection));
  }
  return sections;
}

// Calculate RIASEC scores from answers
function calculateRIASECScores(answers: Record<string, number>, questions: Question[]): Record<string, number> {
  const scores: Record<string, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };

  questions.forEach((question) => {
    const answer = answers[question.id];
    const archetypeCode = question.archetypeCode;

    if (answer !== undefined && archetypeCode && scores[archetypeCode] !== undefined) {
      scores[archetypeCode] += Number(answer);
    }
  });

  return scores;
}

export default function TestTakingContent({ quiz, questions, locale }: TestTakingContentProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Group questions into sections
  const sections = groupQuestionsIntoSections(questions, 6);
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  // Load state from localStorage on mount
  useEffect(() => {
    const storageKey = `profwise_test_${quiz.id}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCurrentSectionIndex(parsed.currentSectionIndex || 0);
        setAnswers(parsed.answers || {});
      } catch (error) {
        console.error('Failed to parse saved test state:', error);
      }
    }

    setIsLoading(false);
  }, [quiz.id]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const storageKey = `profwise_test_${quiz.id}`;
      const data = {
        currentSectionIndex,
        answers,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }, [currentSectionIndex, answers, quiz.id, isLoading]);

  // Check if current section is complete
  const isSectionComplete = currentSection?.every((q) => answers[q.id] !== undefined);

  // Check if all questions are answered
  const isTestComplete = questions.every((q) => answers[q.id] !== undefined);

  const handleAnswerChange = (questionId: string, answer: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isTestComplete || !user) return;

    setIsSubmitting(true);

    try {
      // Calculate RIASEC scores (or other scoring logic based on quiz type)
      const results = calculateRIASECScores(answers, questions);

      // Submit to backend
      await submitQuizResult({
        userId: user.id,
        quizId: quiz.id,
        answers,
        results,
      });

      // Clear localStorage
      const storageKey = `profwise_test_${quiz.id}`;
      localStorage.removeItem(storageKey);

      // Redirect to characteristics page to see updated results
      router.push('/characteristics');
    } catch (error) {
      console.error('Failed to submit test:', error);
      alert('Failed to submit test. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Test section not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">
              Section {currentSectionIndex + 1} of {totalSections}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Section Content */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div>
            <h2 className="text-xl font-bold md:text-2xl">
              Section {currentSectionIndex + 1}
            </h2>
            <p className="text-muted-foreground mt-2">
              Answer all questions to continue
            </p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentSection.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                questionNumber={currentSectionIndex * 6 + index + 1}
                answer={answers[question.id]}
                onAnswerChange={handleAnswerChange}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentSectionIndex < totalSections - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isSectionComplete}
            className="w-full sm:w-auto"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isTestComplete || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submit Test
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Question Item Component
interface QuestionItemProps {
  question: Question;
  questionNumber: number;
  answer: number | undefined;
  onAnswerChange: (questionId: string, answer: number) => void;
  locale: string;
}

function QuestionItem({ question, questionNumber, answer, onAnswerChange, locale }: QuestionItemProps) {
  if (question.type === 'likert') {
    const firstOption = question.options?.[0];
    const lastOption = question.options?.[question.options.length - 1];

    return (
      <div className="space-y-4">
        <p className="font-medium">
          {questionNumber}. {getLocalizedText(question.text, locale)}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </p>

        <div className="space-y-3">
          {/* Likert scale with circles and fixed spacing */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 md:gap-4">
              {question.options?.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => onAnswerChange(question.id, Number(option.value))}
                  className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-105 ${
                    answer === option.value
                      ? 'border-primary bg-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  aria-label={getLocalizedText(option.text, locale)}
                />
              ))}
            </div>

            {/* Labels aligned with first and last circles */}
            <div className="flex items-center justify-between w-full max-w-[calc(5*3rem+4*0.75rem)] md:max-w-[calc(5*3rem+4*1rem)] text-xs text-muted-foreground">
              <span>{firstOption && getLocalizedText(firstOption.text, locale)}</span>
              <span>{lastOption && getLocalizedText(lastOption.text, locale)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (question.type === 'single_choice') {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {questionNumber}. {getLocalizedText(question.text, locale)}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </p>
        <p className="text-sm text-muted-foreground">Select one option</p>

        <div className="space-y-2">
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswerChange(question.id, Number(option.value))}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all flex items-center gap-3 ${
                answer === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  answer === option.value
                    ? 'border-primary'
                    : 'border-muted-foreground'
                }`}
              >
                {answer === option.value && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
              <span>{getLocalizedText(option.text, locale)}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
