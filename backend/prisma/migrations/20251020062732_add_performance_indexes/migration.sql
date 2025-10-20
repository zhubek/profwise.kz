-- CreateIndex
CREATE INDEX "licenses_userId_idx" ON "licenses"("userId");

-- CreateIndex
CREATE INDEX "licenses_organizationId_idx" ON "licenses"("organizationId");

-- CreateIndex
CREATE INDEX "licenses_activated_idx" ON "licenses"("activated");

-- CreateIndex
CREATE INDEX "licenses_userId_activated_idx" ON "licenses"("userId", "activated");

-- CreateIndex
CREATE INDEX "licenses_createdAt_idx" ON "licenses"("createdAt");

-- CreateIndex
CREATE INDEX "profession_archetypes_professionId_idx" ON "profession_archetypes"("professionId");

-- CreateIndex
CREATE INDEX "profession_archetypes_archetypeId_idx" ON "profession_archetypes"("archetypeId");

-- CreateIndex
CREATE INDEX "questions_quizId_idx" ON "questions"("quizId");

-- CreateIndex
CREATE INDEX "quizzes_isPublic_idx" ON "quizzes"("isPublic");

-- CreateIndex
CREATE INDEX "quizzes_isActive_idx" ON "quizzes"("isActive");

-- CreateIndex
CREATE INDEX "quizzes_quizType_idx" ON "quizzes"("quizType");

-- CreateIndex
CREATE INDEX "quizzes_isPublic_isActive_idx" ON "quizzes"("isPublic", "isActive");

-- CreateIndex
CREATE INDEX "results_userId_idx" ON "results"("userId");

-- CreateIndex
CREATE INDEX "results_quizId_idx" ON "results"("quizId");

-- CreateIndex
CREATE INDEX "results_createdAt_idx" ON "results"("createdAt");

-- CreateIndex
CREATE INDEX "results_userId_createdAt_idx" ON "results"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_archetypes_userId_idx" ON "user_archetypes"("userId");

-- CreateIndex
CREATE INDEX "user_archetypes_archetypeId_idx" ON "user_archetypes"("archetypeId");

-- CreateIndex
CREATE INDEX "user_professions_userId_idx" ON "user_professions"("userId");

-- CreateIndex
CREATE INDEX "user_professions_professionId_idx" ON "user_professions"("professionId");

-- CreateIndex
CREATE INDEX "user_professions_userId_createdAt_idx" ON "user_professions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_questions_userId_idx" ON "user_questions"("userId");

-- CreateIndex
CREATE INDEX "user_questions_questionId_idx" ON "user_questions"("questionId");
