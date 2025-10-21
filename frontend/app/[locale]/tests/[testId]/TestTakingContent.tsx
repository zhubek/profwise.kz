'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Test, Question, LocalizedText } from '@/types/test';
import { calculateHollandResult } from '@/lib/api/tests';
import { setQuizCooldown } from '@/lib/utils/quizCooldown';

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

// Enriched answer format that includes scoring and parameters
interface EnrichedAnswer {
  answer: Record<string, number>; // e.g., {"3": 1} - the selected option key and its score
  parameters: {
    type?: string;
    scale?: string;
    [key: string]: any;
  };
}

// Calculate RIASEC scores from enriched answers
function calculateRIASECScores(answers: Record<string, EnrichedAnswer>, questions: Question[]): Record<string, number> {
  const scores: Record<string, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };

  questions.forEach((question) => {
    const answerData = answers[question.id];
    const archetypeCode = question.archetypeCode;

    if (answerData && archetypeCode && scores[archetypeCode] !== undefined) {
      // Get the score from the answer object (e.g., {"3": 1} => score is 1)
      const scoreValue = Object.values(answerData.answer)[0] || 0;
      scores[archetypeCode] += Number(scoreValue);
    }
  });

  return scores;
}

export default function TestTakingContent({ quiz, questions, locale }: TestTakingContentProps) {
  const t = useTranslations('tests');
  const tc = useTranslations('common');
  const router = useRouter();
  const { user } = useAuth();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, EnrichedAnswer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const sectionCardRef = useRef<HTMLDivElement>(null);

  // Group questions into sections
  const sections = groupQuestionsIntoSections(questions, 6);
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  // Auto-scroll to section when navigating between sections
  useEffect(() => {
    if (sectionCardRef.current && !isLoading) {
      // Scroll to the section card with some offset for better visibility
      const yOffset = -20; // 20px offset from top
      const element = sectionCardRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentSectionIndex, isLoading]);

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

  const handleAnswerChange = (questionId: string, selectedValue: number) => {
    // Find the question to get its backend data
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Build the enriched answer object
    const enrichedAnswer: EnrichedAnswer = {
      answer: {
        [String(selectedValue)]: question.backendAnswers?.[String(selectedValue)] ?? selectedValue
      },
      parameters: question.parameters || {}
    };

    setAnswers((prev) => ({ ...prev, [questionId]: enrichedAnswer }));
  };

  // Handler for multiple choice questions (multi-select)
  const handleMultipleChoiceChange = (questionId: string, selectedValue: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    setAnswers((prev) => {
      const currentAnswer = prev[questionId];
      const currentSelections = currentAnswer?.answer || {};
      const valueKey = String(selectedValue);

      // Toggle the selection
      const newSelections = { ...currentSelections };
      if (newSelections[valueKey] !== undefined) {
        // Remove if already selected
        delete newSelections[valueKey];
      } else {
        // Add if not selected
        newSelections[valueKey] = question.backendAnswers?.[valueKey] ?? selectedValue;
      }

      // If no selections remain, remove the answer entirely
      if (Object.keys(newSelections).length === 0) {
        const { [questionId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [questionId]: {
          answer: newSelections,
          parameters: question.parameters || {}
        }
      };
    });
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
      // Calculate RIASEC scores for logging
      const results = calculateRIASECScores(answers, questions);
      console.log('Test completed! RIASEC Scores:', results);

      // Submit to backend - answers are already in the enriched format the backend expects
      const response = await calculateHollandResult({
        answers,
        userId: user.id,
        quizId: quiz.id,
      });

      console.log('Backend calculation complete:', {
        resultId: response.resultId,
        hollandCode: response.hollandCode,
        primaryInterest: response.primaryInterest,
        secondaryInterest: response.secondaryInterest,
        topProfessions: response.topProfessions.length,
      });

      // Set cooldown for 2 minutes (change to 60 minutes for production)
      setQuizCooldown(quiz.id);

      // Clear localStorage
      const storageKey = `profwise_test_${quiz.id}`;
      localStorage.removeItem(storageKey);

      // Redirect to results page to see the detailed results
      router.push(`/${locale}/results/${response.resultId}`);
    } catch (error: any) {
      console.error('Failed to submit test:', error);
      const errorMessage = error?.message || 'Failed to submit test. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{tc('labels.loading')}</p>
      </div>
    );
  }

  if (!currentSection) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{tc('labels.error')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {locale === 'ru' ? 'Прогресс' : locale === 'kz' ? 'Прогресс' : 'Progress'}
            </span>
            <span className="text-muted-foreground">
              {t('section', { current: currentSectionIndex + 1, total: totalSections })}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </Card>

      {/* Section Content */}
      <Card ref={sectionCardRef} className="p-6">
        <div className="space-y-6">
          {/* Section Header */}
          <div>
            <h2 className="text-xl font-bold md:text-2xl">
              {locale === 'ru' ? `Раздел ${currentSectionIndex + 1}` :
               locale === 'kz' ? `Бөлім ${currentSectionIndex + 1}` :
               `Section ${currentSectionIndex + 1}`}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t('answerAllQuestions')}
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
                onMultipleChoiceChange={handleMultipleChoiceChange}
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
          {tc('buttons.previous')}
        </Button>

        {currentSectionIndex < totalSections - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isSectionComplete}
            className="w-full sm:w-auto"
          >
            {tc('buttons.next')}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isTestComplete || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              tc('labels.loading')
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {tc('buttons.submit')}
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
  answer: EnrichedAnswer | undefined;
  onAnswerChange: (questionId: string, answer: number) => void;
  onMultipleChoiceChange: (questionId: string, answer: number) => void;
  locale: string;
}

function QuestionItem({ question, questionNumber, answer, onAnswerChange, onMultipleChoiceChange, locale }: QuestionItemProps) {
  // Extract the selected value from the enriched answer (e.g., {"3": 1} => "3")
  const selectedValue = answer ? Number(Object.keys(answer.answer)[0]) : undefined;

  // For multiple choice, extract array of selected values
  const selectedValues = answer ? Object.keys(answer.answer).map(Number) : [];

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
                    selectedValue === option.value
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

        <div className="space-y-2">
          {question.options?.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswerChange(question.id, Number(option.value))}
              className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all flex items-center gap-3 ${
                selectedValue === option.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedValue === option.value
                    ? 'border-primary'
                    : 'border-muted-foreground'
                }`}
              >
                {selectedValue === option.value && (
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

  if (question.type === 'multiple_choice') {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {questionNumber}. {getLocalizedText(question.text, locale)}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </p>
        <p className="text-sm text-muted-foreground">
          {locale === 'ru' ? 'Выберите все подходящие варианты' :
           locale === 'kz' ? 'Барлық қолайлы нұсқаларды таңдаңыз' :
           'Select all that apply'}
        </p>

        <div className="space-y-2">
          {question.options?.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <button
                key={option.id}
                onClick={() => onMultipleChoiceChange(question.id, Number(option.value))}
                className={`w-full rounded-lg border-2 px-4 py-3 text-left transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}
                >
                  {isSelected && (
                    <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                  )}
                </div>
                <span>{getLocalizedText(option.text, locale)}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
