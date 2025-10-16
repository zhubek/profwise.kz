'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { TestSection, Question, HollandTestState, LocalizedText } from '@/types/test';
import {
  loadHollandTestState,
  saveHollandTestState,
  updateHollandTestAnswers,
  updateHollandTestSection,
  clearHollandTestState,
} from '@/lib/utils/testStorage';
import { submitHollandTest, HOLLAND_TEST_ID } from '@/lib/api/mock/holland';

interface HollandTestContentProps {
  userId: string;
  sections: TestSection[];
}

// Helper function to get localized text
function getLocalizedText(text: LocalizedText, locale: string): string {
  if (typeof text === 'string') return text;
  return text[locale as keyof typeof text] || text.en || '';
}

export default function HollandTestContent({ userId, sections }: HollandTestContentProps) {
  const router = useRouter();
  const locale = useLocale();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadHollandTestState();

    if (savedState) {
      // Continue from saved state
      setCurrentSectionIndex(savedState.currentSectionIndex);
      setAnswers(savedState.answers);
    } else {
      // Initialize new test state
      const newState: HollandTestState = {
        testId: HOLLAND_TEST_ID,
        userId,
        currentSectionIndex: 0,
        answers: {},
        startedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };
      saveHollandTestState(newState);
    }

    setIsLoading(false);
  }, [userId]);

  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  // Check if current section is complete
  const isSectionComplete = currentSection?.questions.every((q) => answers[q.id] !== undefined);

  // Check if all sections are complete
  const isTestComplete = sections.every((section) =>
    section.questions.every((q) => answers[q.id] !== undefined)
  );

  const handleAnswerChange = (questionId: string, answer: number | string | string[]) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    updateHollandTestAnswers(questionId, answer);
  };

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      const newIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(newIndex);
      updateHollandTestSection(newIndex);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      const newIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(newIndex);
      updateHollandTestSection(newIndex);
    }
  };

  const handleSubmit = async () => {
    if (!isTestComplete) return;

    setIsSubmitting(true);

    try {
      // Submit test results
      await submitHollandTest(userId, HOLLAND_TEST_ID, answers);

      // Clear localStorage
      clearHollandTestState();

      // Redirect to results or tests page
      router.push('/tests');
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
        <p className="text-muted-foreground">Test not found</p>
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
            <h2 className="text-xl font-bold md:text-2xl">{getLocalizedText(currentSection.title, locale)}</h2>
            <p className="text-muted-foreground mt-2">{getLocalizedText(currentSection.description, locale)}</p>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentSection.questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                questionNumber={index + 1}
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
  answer: number | string | string[] | undefined;
  onAnswerChange: (questionId: string, answer: number | string | string[]) => void;
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
                  onClick={() => onAnswerChange(question.id, option.value)}
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

  if (question.type === 'multiple_choice') {
    return (
      <div className="space-y-3">
        <p className="font-medium">
          {questionNumber}. {getLocalizedText(question.text, locale)}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </p>
        <p className="text-sm text-muted-foreground">Select all that apply</p>

        <div className="space-y-2">
          {question.options?.map((option) => {
            const selectedValues = (answer as string[]) || [];
            const isSelected = selectedValues.includes(String(option.value));

            return (
              <button
                key={option.id}
                onClick={() => {
                  const newValues = isSelected
                    ? selectedValues.filter((v) => v !== String(option.value))
                    : [...selectedValues, String(option.value)];
                  onAnswerChange(question.id, newValues);
                }}
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
              onClick={() => onAnswerChange(question.id, option.value)}
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
