// SET UP JSPSYCH
// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format

var jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData("csv");
  }
});

// --------------------
// MAZE TASK
// --------------------

// MAZE TRIAL
// this is the code to create our basic maze trial

// it uses the `plugin-maze-keyboard.js` plugin which is just a modified html keyboard response

// we add a progress bar to let participants know how far in to the story they are
// this works based on the `Word_tally` variable in the stimuli, which increases by one for each new word pair
// the progress bar has a maximum value based on the `Total_words` variable, which is a static number that is calculated a the largest `Word_tally` value in the story

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

// -------------------
// COMPREHENSION QUESTIONS
// -------------------

// typically we want to check that participants are paying attention and have comprehended the story
// to check this we can use comprehension questions which are presented after the participant has read the story
// these are typically in the form of a question that has 2 answers, one correct and one distractor

// COMPREHENSION TRIAL
// the comprehension question is presented in the same way as a `maze_trial`
// i.e. there are two answers, one on the left and one on the right, with the location randomly assigned, participants press `e` or `i`

var comprehension_trial = {
    type: jsPsychMazeKeyboard,
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
    data: { trial1: 'instructions'},
    pages: ["That is the end of the story.<br/><br/>You will now be asked a number of questions.<br/><br/>Press <b>'e'</b> if you think the correct answer is on the left and <b>'i'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

// we now create an instructions page to separate the end of the comprehension questions and the start of the next story

var next_story_instructions = {
    type: jsPsychInstructions,
    data: { trial1: 'instructions'},
    pages: ["We will now move on to the next story. Feel free to take a short rest.<br/><br/>Press <b>'e'</b> if you think the correct answer is on the left and <b>'i'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};
