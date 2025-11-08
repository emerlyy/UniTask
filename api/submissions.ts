type UpdateSubmissionScoreSource = "auto" | "manual";

export type UpdateSubmissionScorePayload = {
  score: number;
  source: UpdateSubmissionScoreSource;
};

export type UpdateSubmissionScoreResponse = {
  data: {
    id: string;
    status: "graded";
    finalScore: number;
    source: UpdateSubmissionScoreSource;
    updatedAt: string;
  };
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const updateSubmissionScore = async (
  submissionId: string,
  payload: UpdateSubmissionScorePayload,
): Promise<UpdateSubmissionScoreResponse> => {
  await delay(300);

  return {
    data: {
      id: submissionId,
      status: "graded",
      finalScore: payload.score,
      source: payload.source,
      updatedAt: new Date().toISOString(),
    },
  };
};

export const submissionsApi = {
  updateSubmissionScore,
};
