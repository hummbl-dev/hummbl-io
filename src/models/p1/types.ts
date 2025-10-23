export interface FirstPrinciplesModel {
  id: string;
  name: string;
  description: string;
  transformation: string;
  tier: number;
  keyCharacteristics: string[];
  relatedModels: string[];
  example: {
    problem: string;
    traditionalApproach: string;
    firstPrinciplesApproach: string;
  };
  methods: {
    decomposeProblem: (problem: string) => string[];
    identifyAssumptions: (problem: string) => string[];
    extractFundamentalTruths: (problem: string) => string[];
    rebuildSolution: (truths: string[]) => string;
  };
}

export interface FirstPrinciplesAnalysis {
  problem: string;
  decomposed: string[];
  assumptions: string[];
  fundamentalTruths: string[];
  solution: string;
}