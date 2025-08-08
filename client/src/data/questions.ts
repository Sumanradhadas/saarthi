import { MCQQuestion, ImageQuestion, FunBreak } from "../types/test";

export const mcqQuestions: MCQQuestion[] = [
  {
    id: "mcq1",
    subject: "Pharmacology",
    text: "Which of the following is a beta-blocker used in hypertension?",
    options: [
      { id: "A", text: "Atropine" },
      { id: "B", text: "Propranolol" },
      { id: "C", text: "Captopril" },
      { id: "D", text: "Amlodipine" },
    ],
    correctAnswer: "B",
    explanation:
      "Propranolol is a non-selective beta-blocker used to manage hypertension by decreasing heart rate and cardiac output.",
    icon: "fas fa-pills",
  },
  {
    id: "mcq2",
    subject: "Genetics",
    text: "Which cell is mainly responsible for producing antibodies?",
    options: [
      { id: "A", text: "T cells" },
      { id: "B", text: "B cells" },
      { id: "C", text: "Platelets" },
      { id: "D", text: "Macrophages" },
    ],
    correctAnswer: "B",
    explanation:
      "B cells differentiate into plasma cells which produce antibodies to fight antigens.",
    icon: "fas fa-dna",
  },
  {
    id: "mcq3",
    subject: "Pharmacology",
    text: "Penicillin inhibits bacterial growth by interfering with:",
    options: [
      { id: "A", text: "DNA replication" },
      { id: "B", text: "Cell wall synthesis" },
      { id: "C", text: "Protein synthesis" },
      { id: "D", text: "RNA synthesis" },
    ],
    correctAnswer: "B",
    explanation:
      "Penicillin disrupts the synthesis of bacterial cell walls, leading to lysis of the bacteria.",
    icon: "fas fa-syringe",
  },
  {
    id: "mcq4",
    subject: "Genetics",
    text: "Hemophilia is an example of:",
    options: [
      { id: "A", text: "Autosomal dominant" },
      { id: "B", text: "Autosomal recessive" },
      { id: "C", text: "X-linked recessive" },
      { id: "D", text: "Mitochondrial disorder" },
    ],
    correctAnswer: "C",
    explanation:
      "Hemophilia is inherited in an X-linked recessive pattern, mostly affecting males.",
    icon: "fas fa-dna",
  },
  {
    id: "mcq5",
    subject: "Pathology",
    text: "The first phase of acute inflammation is:",
    options: [
      { id: "A", text: "Vasodilation" },
      { id: "B", text: "Margination" },
      { id: "C", text: "Chemotaxis" },
      { id: "D", text: "Phagocytosis" },
    ],
    correctAnswer: "A",
    explanation:
      "Vasodilation increases blood flow and is the initial vascular response in acute inflammation.",
    icon: "fas fa-microscope",
  },
  {
    id: "mcq6",
    subject: "Pharmacology",
    text: "Drug half-life refers to:",
    options: [
      { id: "A", text: "Time for maximum effect" },
      { id: "B", text: "Time to excrete drug" },
      { id: "C", text: "Time for 50% elimination" },
      { id: "D", text: "Time to metabolize drug" },
    ],
    correctAnswer: "C",
    explanation:
      "Half-life is the time taken for the plasma concentration of a drug to reduce by 50%.",
    icon: "fas fa-pills",
  },
  {
    id: "mcq7",
    subject: "Genetics",
    text: "Oncogenes are:",
    options: [
      { id: "A", text: "Tumor suppressor genes" },
      { id: "B", text: "Genes for inflammation" },
      { id: "C", text: "Normal genes" },
      { id: "D", text: "Cancer-causing genes" },
    ],
    correctAnswer: "D",
    explanation:
      "Oncogenes are mutated forms of proto-oncogenes that can cause uncontrolled cell division.",
    icon: "fas fa-dna",
  },
  {
    id: "mcq8",
    subject: "Pharmacology",
    text: "Which one is a loop diuretic?",
    options: [
      { id: "A", text: "Spironolactone" },
      { id: "B", text: "Furosemide" },
      { id: "C", text: "Thiazide" },
      { id: "D", text: "Mannitol" },
    ],
    correctAnswer: "B",
    explanation:
      "Furosemide is a potent loop diuretic that acts on the thick ascending limb of the loop of Henle.",
    icon: "fas fa-pills",
  },
  {
    id: "mcq9",
    subject: "Pharmacology",
    text: "Reye's syndrome is associated with:",
    options: [
      { id: "A", text: "Paracetamol" },
      { id: "B", text: "Aspirin in children" },
      { id: "C", text: "Ibuprofen overdose" },
      { id: "D", text: "Vitamin D toxicity" },
    ],
    correctAnswer: "B",
    explanation:
      "Reye’s syndrome is a rare but serious condition that can occur in children given aspirin during viral infections.",
    icon: "fas fa-syringe",
  },
  {
    id: "mcq10",
    subject: "Pathology",
    text: "Which phase of the cell cycle is most radiosensitive?",
    options: [
      { id: "A", text: "G0 phase" },
      { id: "B", text: "G1 phase" },
      { id: "C", text: "S phase" },
      { id: "D", text: "M phase" },
    ],
    correctAnswer: "D",
    explanation:
      "M phase is the most radiosensitive as the chromatin is condensed and more susceptible to radiation damage.",
    icon: "fas fa-microscope",
  },
];

export const imageQuestions: ImageQuestion[] = [
  {
    id: "img1",
    subject: "Pharmacology",
    text: "Describe the mechanism of action, therapeutic uses, adverse effects, and contraindications of NSAIDs.",
    marks: 10,
    markingScheme: {
      keyPoints: [
        "Mechanism: COX inhibition",
        "Uses: Pain, fever, inflammation",
        "Adverse effects: GI, renal, bleeding",
        "Contraindications: Peptic ulcer, asthma, renal disease",
      ],
      fullMarksCriteria: [
        "Each section explained clearly",
        "Correct examples of NSAIDs given",
        "Common side effects accurately described",
        "At least 3 contraindications listed",
      ],
    },
    icon: "fas fa-pills",
  },
  {
    id: "img2",
    subject: "Pathology",
    text: "Differentiate between benign and malignant tumors.",
    marks: 5,
    markingScheme: {
      keyPoints: [
        "Definition of both",
        "Growth rate",
        "Invasion/metastasis",
        "Examples of each",
      ],
      fullMarksCriteria: [
        "Clear comparison",
        "All features mentioned",
        "Logical presentation",
        "At least one example each",
      ],
    },
    icon: "fas fa-microscope",
  },
  {
    id: "img3",
    subject: "Genetics",
    text: "Define autosomal dominant inheritance with an example.",
    marks: 5,
    markingScheme: {
      keyPoints: [
        "Definition of autosomal dominant",
        "One parent passes the gene",
        "No skipping of generations",
        "Example such as Marfan syndrome",
      ],
      fullMarksCriteria: [
        "Clear and concise definition",
        "Example relevant and correct",
        "Correct explanation of inheritance pattern",
      ],
    },
    icon: "fas fa-dna",
  },
];

export const funBreaks: FunBreak[] = [
  {
    id: "break1",
    type: "meme",
    content: {
      emoji: "📚😴",
      title: "Time for a Break!",
      description: "You're doing great! Let's lighten up a bit 😊",
      memeText:
        '"When you realize pharmacology has more names than a Bollywood family drama"',
    },
  },
  {
    id: "break2",
    type: "question",
    content: {
      emoji: "☕",
      title: "Quick Coffee Break!",
      question: "What's your favorite chai spot in college?",
      placeholder: "Share your go-to chai place...",
      description: "I bet it's the place with the best gossip too! 😄",
    },
  },
];
