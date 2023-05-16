// SET UP JSPSYCH
// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format

var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData("csv");
  }
});

// MAZE TASK

// STIMULI
// these are basic stimuli consisting of two trials for the maze task contained in maze_story_1
// the 'Target' is the correct word and the 'Distractor' is always incorrect
// the 'Story_num', 'Sentence_num' and 'Word_num' properties are slightly irrelevant for this demo
// but would be very useful for a full maze task

// there is a better way to create a full stimuli list and store it as a .js file
// see maze_stimuli_create.R for code to convert a .csv file to a .js file to do this

var maze_story_1 = [{
        "Story_num": 1,
        "Sentence_num": 1,
        "Word_num": 1,
        "Word_tally": 1,
        "Total_words": 8,
        "Target": "This",
        "Distractor": "x-x-x"
    },
    {
        "Story_num": 1,
        "Sentence_num": 1,
        "Word_num": 2,
        "Word_tally": 2,
        "Total_words": 8,
        "Target": "is",
        "Distractor": "us"
    },
    {
        "Story_num": 1,
        "Sentence_num": 1,
        "Word_num": 3,
        "Word_tally": 3,
        "Total_words": 8,
        "Target": "a",
        "Distractor": "ha"
    },
    {
        "Story_num": 1,
        "Sentence_num": 1,
        "Word_num": 4,
        "Word_tally": 4,
        "Total_words": 8,
        "Target": "sentence.",
        "Distractor": "views."
    },
    {
        "Story_num": 1,
        "Sentence_num": 2,
        "Word_num": 1,
        "Word_tally": 5,
        "Total_words": 8,
        "Target": "It",
        "Distractor": "x-x-x"
    },
    {
        "Story_num": 1,
        "Sentence_num": 2,
        "Word_num": 2,
        "Word_tally": 6,
        "Total_words": 8,
        "Target": "has",
        "Distractor": "sun"
    },
    {
        "Story_num": 1,
        "Sentence_num": 2,
        "Word_num": 3,
        "Word_tally": 7,
        "Total_words": 8,
        "Target": "no",
        "Distractor": "sit"
    },
    {
        "Story_num": 1,
        "Sentence_num": 2,
        "Word_num": 4,
        "Word_tally": 8,
        "Total_words": 8,
        "Target": "intelocutors",
        "Distractor": "confederation"
    }
];


// MAZE TRIAL
// this is the code to create our basic maze trial

// it uses the `plugin-maze-keyboard.js` plugin which is just a modified html keyboard response

// the `on_start` part shuffles the order of the target and distractor words, so that one is on the left and one is on the right
// this is assigned using the `data.stimulus_left` and `data.stimulus_right` assignments
// we use `jsPsych.timelineVariable` to tell jsPsych which uses the properties from our `maze_story_1` stimuli, we assign these values in `maze_task_story_1` later using `timeline_variables`

// we also assign `data.Target` to indicate which word is the target so we can check if the participant has responded correctly
// the `choices` are the keyboard input that we want to use as the input, here we use 'e' and 'i'
// the instructions will tell the participant to press 'e' for the word on the left and 'i' for the word on the right

// the `on_finish` part then creates data relating to whether the participant responded correctly, i.e. if they chose the target word by pressing the intended key
// this is done using an if statement where if the target is on the left AND the key pressed is 'e' the variable `correct` will be 1
// if the target is on the right AND the key pressed is 'i' the `correct` variable will also be 1
// every other combination will have a `correct` value of 0, i.e. if the target is on the left AND the key pressed is 'i'

// how does jspsych know which button was pressed?
// we first make variable called `data` which we use to store the last response provided by the participant i.e. the last button pressed in the trial
// this is done using `jsPsych.data.get().last(1).values()[0]` which will have the values for `stimulus_left`, `stimulus_right` and `Target`
// next we will use the `jsPsych.pluginAPI.compareKeys` function that will compare:
// if `stimulus_left` is the same as `Target` AND the key pressed is 'e' then correct = 1
// else if `stimulus_right` is the same as `Target` AND the key pressed is 'i' then correct = 1
// else correct = 0
// this is important as the target and distractor are randomly assigned a left/right position so this allows for full randomisation of the stimuli per trial

// we also store the other variables that might be helpful for our analysis, e.g. Story_num, Sentence_num, Word_num, trial1 (this is maze as it is a maze trial)

var maze_trial = {
    type: jsPsychMazeKeyboard,
    prompt: function() {
        var progress_bar = '<relative><progress id="progress_bar" value="' + jsPsych.timelineVariable('Word_tally') + '" max="' + jsPsych.timelineVariable("Total_words") + '"></progress></relative>';

        return progress_bar;
    },
    on_start: function(data) {
        var random1 = jsPsych.randomization.shuffle([
            jsPsych.timelineVariable('Target'),
            jsPsych.timelineVariable('Distractor')
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.Target = jsPsych.timelineVariable('Target');
        data.Distractor = jsPsych.timelineVariable('Distractor');
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

        data.Story_num = jsPsych.timelineVariable('Story_num');
        data.Sentence_num = jsPsych.timelineVariable('Sentence_num');
        data.Word_num = jsPsych.timelineVariable('Word_num');
        data.trial1 = "maze";
    }
};

// ERROR TRIAL
// one innovative aspect of the maze task used by Boyce and Levy (2023) is the introduction of a redo mode
// this means if the participant does not choose the correct key input for the target (i.e. if they choose the left word but the target is on the right) they redo that specific maze pair
// see https://vboyce.github.io/Maze/redo.html for a detailed outline and justification by Boyce for using this

// the `error_trial` below is simply a html keyboard response, which shows a red x on the screen for 350 ms
// we will use this trial only when the participant does not press the correct key

// note that the trial_duration of 350 ms is somewhat arbitrary and can be modified
// see https://vboyce.github.io/Maze/delay.html for more discussion
// I personally think 350 ms is quick enough to not be annoying but long enough to allow the participant to see they made an error
// you can also change the `x` to a message, e.g. `incorrect try again` but this might disrupt the sentence processing

var error_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p style='color: red; font-size: 24pt;'>x</p>",
    choices: "NO_KEYS",
    trial_duration: 350,
    data: {
        "trial1": "error"
    }
};

// KEY CHECK
// as we need to check if the participant was correct in the trial we should check the key that was pressed and compare it to what the correct key was
// this code is identical to the code used in the on_finish function in the maze_trial
// the only edit is that we use `return false` if the response is correct and `return true` if incorrect
// we will use this function to determine whether or not to show the `error_trial`

function key_check() {
    var data = jsPsych.data.get().last(1).values()[0];

    if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
            data.Target) &&
        data.response == "e") {
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
            data.Target) &&
        data.response == "i") {
        return false;
    } else {
        return true;
    }
};

// IF NODE
// if we want to show the `error_trial` then we have to create a conditional variable where `error_trial` is shown only if the `key_check` returns true i.e. the participant did not chose the target
// this is done by creating the variable `if_node` which takes the `error_trial` as the timeline variable
// the `conditional_function` uses `key_check` which means it will only use the `error_trial` if `key_check` returns true
// if `key_check` returns false then the `error_trial` will not be shown

var if_node = {
    timeline: [error_trial],
    conditional_function: key_check
};

// LOOP NODE
// now we have our `maze_trial` and `if_node` set up we need a way to loop through the two so that it follows this workflow:

// show maze_trial
// if incorrect show error_trial and return to the same maze_trial
// repeat maze_trial until correct

// we can do this using a `loop_function` where the timeline will consist of `maze_trial` and `if_node`, which will be looped through on the basis of our `key_check` function
// i.e. if incorrect keep showing `maze_trial` and `error_trial` until `key_check` returns false

// this is workflow is stored as the variable `loop_node`

var loop_node = {
    timeline: [maze_trial, if_node],
    loop_function: key_check
};

// MAZE TASK STORY

// now we have the basic workflow of the maze set up we need to make a final variable that uses the `loop_node` with our maze stimuli
// we can use `timeline_variables` to do this by assigning the stimuli from `maze_story_1`

var maze_task_story_1 = {
    timeline: [loop_node],
    timeline_variables: maze_story_1
};




// COMPREHENSION QUESTIONS
// typically we want to check that participants are paying attention and have comprehended the story
// to check this we can use comprehension questions which are presented after the participant has read the story
// these are typically in the form of a question that has 2 answers, one correct and one distractor

// STIMULI
// there are also stimuli for two comprehension questions contained in maze_questions_1
// there are two possible answers `Answer1` and `Answer2`
// Answer1 is always the correct one

// we will again include `Story_num` so we can store which story the questions relate to
// there is also `Question_num` which indexes which question is being asked

// we store the stimuli in the variable `maze_questions_1`

var maze_questions_1 = [
  {
    "Story_num": "1",
    "Question_num": "1",
    "Question": "What was the first word you selected?",
    "Answer1": "This",
    "Answer2": "x-x-x"
  },
  {
    "Story_num": "1",
    "Question_num": "2",
    "Question": "Which word is longer?",
    "Answer1": "Floccinaucinihilipilification",
    "Answer2": "The"
  }
];

// COMPREHENSION TRIAL
// the comprehension question is presented in the same way as a `maze_trial`
// i.e. there are two answers, one on the left and one on the right, with the location randomly assigned, participants press `e` or `i`

var comprehension_trial = {
    type: jsPsychMazeKeyboard,
    on_start: function(data) {
        var random1 = jsPsych.randomization.shuffle([
            jsPsych.timelineVariable('Answer1'),
            jsPsych.timelineVariable('Answer2')
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.Target = jsPsych.timelineVariable('Answer1');
        data.Distractor = jsPsych.timelineVariable('Answer2');
    },
    choices: ["e", "i"],
    prompt: jsPsych.timelineVariable('Question'),
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

        data.Story_num = jsPsych.timelineVariable('Story_num');
        data.Question_num = jsPsych.timelineVariable('Question_num');
        data.Question = jsPsych.timelineVariable('Question');
        data.trial1 = "maze_comprehension";
    }
};

// COMPREHENSION QUESTIONS

// as we are likely to have more than one comprehension question we need to use `timeline_variables` to go through our `maze_questions_1` stimuli
// note that it is not useful to do the error checking for the comprehension questions as we want to see if the participant actually chooses the correct answer

var comprehension_instructions = {
    type: jsPsychInstructions,
    pages: ["That is the end of the story.<br/><br/>You will now be asked a number of questions.<br/><br/>Press <b>'e'</b> if you think the correct answer is on the left and <b>'i'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

var comprehension_questions_1 = {
    timeline: [comprehension_trial],
    timeline_variables: maze_questions_1
};

// MAZE TASK COMPLETE
// now we have all the parts to run our maze task - maze_task_story_1 and comprehension_questions_1
// we put them together in a timline and store it as `maze_task_complete_1`
// this will run through the maze trials with the error checking and once finished present the comprehension questions after

var maze_task_complete_1 = {
    timeline: [maze_task_story_1, comprehension_instructions, comprehension_questions_1]
};

var timeline = [];
timeline.push(maze_task_complete_1);

jsPsych.run(timeline);
