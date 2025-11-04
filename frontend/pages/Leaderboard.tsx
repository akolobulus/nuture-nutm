import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Medal, Crown, Brain, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "@/components/ui/use-toast";

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  category: string;
}

interface LeaderboardEntry {
  rank: number;
  userID: string;
  name: string;
  avatar: string | null;
  score: number;
  total: number;
  percentage: number;
  submittedAt: string;
}

export default function Leaderboard() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ["quiz-questions"],
    queryFn: async () => {
      const response = await fetch("http://localhost:4000/quiz/questions", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json();
    },
    enabled: showQuiz && !quizCompleted,
  });

  const { data: leaderboardData, isLoading: loadingLeaderboard } = useQuery({
    queryKey: ["quiz-leaderboard"],
    queryFn: async () => {
      const response = await fetch("http://localhost:4000/quiz/leaderboard", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch leaderboard");
      return response.json();
    },
  });

  const { data: myStats } = useQuery({
    queryKey: ["my-quiz-stats"],
    queryFn: async () => {
      const response = await fetch("http://localhost:4000/quiz/my-stats", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (submissionAnswers: Record<string, string>) => {
      const response = await fetch("http://localhost:4000/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answers: submissionAnswers }),
      });
      if (!response.ok) throw new Error("Failed to submit quiz");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Quiz Completed!",
        description: `You scored ${data.score}/${data.total} (${data.percentage}%)`,
      });
      setQuizCompleted(true);
      queryClient.invalidateQueries({ queryKey: ["quiz-leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["my-quiz-stats"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < (questionsData?.questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    submitQuizMutation.mutate(answers);
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-700" />;
      default:
        return <span className="w-5 text-center font-semibold text-muted-foreground">{position}</span>;
    }
  };

  const questions = questionsData?.questions || [];
  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showQuiz && !quizCompleted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            {loadingQuestions ? (
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">Loading quiz...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Health Knowledge Quiz</h1>
                    <Badge variant="outline">
                      Question {currentQuestion + 1} of {questions.length}
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-[#00A859] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-[#00A859]" />
                      <Badge variant="secondary">{currentQ?.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{currentQ?.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentQ && ["A", "B", "C", "D"].map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswerSelect(currentQ.id, option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          answers[currentQ.id] === option
                            ? "border-[#00A859] bg-[#00A859]/10"
                            : "border-border hover:border-[#00A859]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQ.id] === option ? "border-[#00A859] bg-[#00A859]" : "border-border"
                          }`}>
                            {answers[currentQ.id] === option && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="font-semibold">{option}.</span>
                          <span>{currentQ.options[option as keyof typeof currentQ.options]}</span>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={Object.keys(answers).length !== questions.length}
                      className="bg-[#00A859] hover:bg-[#00A859]/90"
                    >
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      className="bg-[#00A859] hover:bg-[#00A859]/90"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Brain className="w-10 h-10 text-[#00A859]" />
              <h1 className="text-4xl font-bold">Weekly Health Quiz</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Test your health knowledge with 150 questions updated every week
            </p>
          </div>

          {myStats?.currentWeek && (
            <Card className="mb-8 border-[#00A859]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#00A859]" />
                  Your Performance This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-[#00A859]">{myStats.currentWeek.percentage}%</p>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{myStats.currentWeek.score}/{myStats.currentWeek.total}</p>
                    <p className="text-sm text-muted-foreground">Questions</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{myStats.overall.totalAttempts}</p>
                    <p className="text-sm text-muted-foreground">Total Attempts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!myStats?.currentWeek && (
            <Card className="mb-8 border-[#00A859]/20">
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-[#00A859]" />
                <h3 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h3>
                <p className="text-muted-foreground mb-6">
                  Take this week's quiz with 150 health questions designed for students
                </p>
                <Button
                  onClick={() => setShowQuiz(true)}
                  size="lg"
                  className="bg-[#00A859] hover:bg-[#00A859]/90"
                >
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#00A859]" />
                Weekly Leaderboard
              </CardTitle>
              <CardDescription>
                Top performers updated every week as quizzes rotate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLeaderboard ? (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Loading leaderboard...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboardData?.leaderboard?.map((entry: LeaderboardEntry) => (
                    <div
                      key={entry.userID}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8">
                        {getPositionIcon(entry.rank)}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.score}/{entry.total} questions correct
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#00A859]">
                          {entry.percentage.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">accuracy</p>
                      </div>
                    </div>
                  ))}

                  {leaderboardData?.leaderboard?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No submissions yet this week.</p>
                      <p className="text-sm mt-2">Be the first to take the quiz!</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
