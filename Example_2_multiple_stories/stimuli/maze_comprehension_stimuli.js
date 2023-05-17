// STIMULI
// there are also stimuli for two comprehension questions contained in maze_questions_1
// there are two possible answers `Target` and `Distractor`
// Target is always the correct one

// we will again include `Story_num` so we can store which story the questions relate to
// there is also `Question_num` which indexes which question is being asked

// we store the stimuli in the variable `maze_questions_1`

var maze_questions_1 = [
  {
    "Story_num": "1",
    "Question_num": "1",
    "Question": "What was the first word you selected?",
    "Target": "This",
    "Distractor": "x-x-x"
  },
  {
    "Story_num": "1",
    "Question_num": "2",
    "Question": "Which word is longer?",
    "Target": "Floccinaucinihilipilification",
    "Distractor": "The"
  }
];

var maze_questions_2 = [
  {
    "Story_num": "2",
    "Question_num": "1",
    "Question": "What was the second word you selected?",
    "Target": "is",
    "Distractor": "us"
  },
  {
    "Story_num": "2",
    "Question_num": "2",
    "Question": "Which word is shorter?",
    "Target": "The",
    "Distractor": "Floccinaucinihilipilification"
  }
];
