// SET UP JSPSYCH
// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format

var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData("csv");
  }
});


  var timeline = [];

  var mystimuli = [
  {
    "Story_num": 1,
    "Total_words": 1073,
    "values": [
      {
        "Sentence_num": 1,
        "Word_num": 1,
        "Word_tally": 1,
        "Target": "If",
        "Distractor": "x-x-x"
      },
      {
        "Sentence_num": 1,
        "Word_num": 2,
        "Word_tally": 2,
        "Target": "you",
        "Distractor": "door"
      },
      {
        "Sentence_num": 1,
        "Word_num": 3,
        "Word_tally": 3,
        "Target": "were",
        "Distractor": "anti"
      },
      {
        "Sentence_num": 1,
        "Word_num": 4,
        "Word_tally": 4,
        "Target": "to",
        "Distractor": "pre"
      },
      {
        "Sentence_num": 1,
        "Word_num": 5,
        "Word_tally": 5,
        "Target": "journey",
        "Distractor": "seasons"
      },
      {
        "Sentence_num": 1,
        "Word_num": 6,
        "Word_tally": 6,
        "Target": "to",
        "Distractor": "ha"
      },
      {
        "Sentence_num": 1,
        "Word_num": 7,
        "Word_tally": 7,
        "Target": "the",
        "Distractor": "lady"
      },
      {
        "Sentence_num": 1,
        "Word_num": 8,
        "Word_tally": 8,
        "Target": "North",
        "Distractor": "Worry"
      },
      {
        "Sentence_num": 1,
        "Word_num": 9,
        "Word_tally": 9,
        "Target": "of",
        "Distractor": "rise"
      },
      {
        "Sentence_num": 1,
        "Word_num": 10,
        "Word_tally": 10,
        "Target": "England,",
        "Distractor": "Created,"
      }
    ],
    "questions": [
      {
        "Question_num": 1,
        "Question": "What is depicted on the Crest of the City of Bradford?",
        "Target": "boar's head",
        "Distractor": "a spinning jenny"
      },
      {
        "Question_num": 2,
        "Question": "Who suggested a possible solution for the boar problem?",
        "Target": "Lord of the Manor",
        "Distractor": "the people of Bradford"
      },
      {
        "Question_num": 3,
        "Question": "How did the huntsman kill the boar?",
        "Target": "using a bow and arrows",
        "Distractor": "using a big knife"
      },
      {
        "Question_num": 4,
        "Question": "Where was the shortcut to the Manor House located?",
        "Target": "around the pond",
        "Distractor": "around the hill"
      },
      {
        "Question_num": 5,
        "Question": "Which huntsman was lying to the Lord of the Manor?",
        "Target": "the one who carried the boar to the Manor House",
        "Distractor": "the one who cut out the boar's tongue"
      },
      {
        "Question_num": 6,
        "Question": "What did the huntsman who killed the boar receive as a reward?",
        "Target": "a piece of land",
        "Distractor": "an honorable title"
      }
    ]
  },
  {
    "Story_num": 2,
    "Total_words": 990,
    "values": [
      {
        "Sentence_num": 1,
        "Word_num": 1,
        "Word_tally": 1,
        "Target": "A",
        "Distractor": "x-x-x"
      },
      {
        "Sentence_num": 1,
        "Word_num": 2,
        "Word_tally": 2,
        "Target": "clear",
        "Distractor": "rates"
      },
      {
        "Sentence_num": 1,
        "Word_num": 3,
        "Word_tally": 3,
        "Target": "and",
        "Distractor": "pre"
      },
      {
        "Sentence_num": 1,
        "Word_num": 4,
        "Word_tally": 4,
        "Target": "joyous",
        "Distractor": "booths"
      },
      {
        "Sentence_num": 1,
        "Word_num": 5,
        "Word_tally": 5,
        "Target": "day",
        "Distractor": "nor"
      },
      {
        "Sentence_num": 1,
        "Word_num": 6,
        "Word_tally": 6,
        "Target": "it",
        "Distractor": "le"
      },
      {
        "Sentence_num": 1,
        "Word_num": 7,
        "Word_tally": 7,
        "Target": "was",
        "Distractor": "cent"
      },
      {
        "Sentence_num": 1,
        "Word_num": 8,
        "Word_tally": 8,
        "Target": "and",
        "Distractor": "whom"
      },
      {
        "Sentence_num": 1,
        "Word_num": 9,
        "Word_tally": 9,
        "Target": "out",
        "Distractor": "jack"
      },
      {
        "Sentence_num": 1,
        "Word_num": 10,
        "Word_tally": 10,
        "Target": "on",
        "Distractor": "al"
      }
    ],
    "questions": [
      {
        "Question_num": 1,
        "Question": "Who was Aqua's mother?",
        "Target": "the ocean",
        "Distractor": "the sky"
      },
      {
        "Question_num": 2,
        "Question": "What did Aqua want to try?",
        "Target": "riding on a cloud",
        "Distractor": "getting to the bottom of the ocean"
      },
      {
        "Question_num": 3,
        "Question": "Who took pity on Aqua when he was frightened by the cold and darkness as the Sun set?",
        "Target": "the wind",
        "Distractor": "a cloud"
      },
      {
        "Question_num": 4,
        "Question": "Where did the mountain brook empty into?",
        "Target": "a pond",
        "Distractor": "a river"
      },
      {
        "Question_num": 5,
        "Question": "Who did Aqua play with in the pond?",
        "Target": "his brother",
        "Distractor": "his sister"
      },
      {
        "Question_num": 6,
        "Question": "How did Aqua get back into the ocean at the end of the journey?",
        "Target": "via a river",
        "Distractor": "fell from a cloud in the form of rain"
      }
    ]
  }
];

// global variables to hold the current distractor array and distractor index during the experiment
var curr_distractor_array, curr_index;


var maze_trial = {
  type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p style='color: red; font-size: 24pt;'>x</p>",
    choices: "NO_KEYS",
    trial_duration: 350,
    on_finish: function() {
      curr_distractor_array = jsPsych.timelineVariable('values');
      curr_index = 0;
    }
};


var maze_trial1 = {
    type: jsPsychMazeKeyboard,
    prompt: function() {
        var progress_bar = '<relative><progress id="progress_bar" value="' +
        jsPsych.timelineVariable('values')[curr_index].Word_num +
        '" max="' +
        jsPsych.timelineVariable("Total_words") +
        '"></progress></relative>';

        return progress_bar;
    },
    on_start: function(data) {

        var random1 = jsPsych.randomization.shuffle([
            jsPsych.timelineVariable('values')[curr_index].Target,
            jsPsych.timelineVariable('values')[curr_index].Distractor
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.Target = jsPsych.timelineVariable('values')[curr_index].Target;
        data.Distractor = jsPsych.timelineVariable('values')[curr_index].Distractor;
    },
    choices: ["e", "i"],

    on_finish: function() {
        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == "e") {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == "i") {
            data.correct = 1;
        } else {
            data.correct = 0;
        };
        data.trial1 = "maze";
      }
};


function key_check() {
    var data = jsPsych.data.get().last(1).values()[0];

    if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
            data.Target) &&
        data.response == "e") {
          // curr_index++;
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
            data.Target) &&
        data.response == "i") {
          // curr_index++;
        return false;
    } else {
        return true;
    }
};

var variable_distractor_trials1 = {
    timeline: [maze_trial1],
    loop_function() {
      curr_index++;
      if (curr_index == curr_distractor_array.length) {
        return false;
      } else {
        return true;
      }
    }
};

var maze_task_story_1 = {
    timeline: [maze_trial, variable_distractor_trials1],
    timeline_variables: mystimuli
};

timeline.push(maze_task_story_1);


jsPsych.run(timeline);
