// SET UP JSPSYCH
// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format
var jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData("csv");
    }
});


var timeline = [];

// global variables to hold the current distractor array and distractor index during the experiment
var curr_distractor_array, curr_index;


var maze_trial = {
    type: jsPsychInstructions,
    data: {
        trial1: 'instructions'
    },
    pages: ["<b>maze-jspsych example</b><br/><br/><p>For this experiment, please place your left index finger on the 'e' key and your right index finger on the 'i' key.</p><p> You will read sentences word by word. On each screen you will see two options: one will be the next word in the sentence, and one will not. Select the word that continues the sentence by pressing 'e' (left-hand) for the word on the left or pressing 'i' (right-hand) for the word on the right.</p><p>Select the best word as quickly as you can, but without making too many errors.</p>"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

var maze_reset = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: " ",
    choices: "NO_KEYS",
    trial_duration: 0,
    data: {
        trial1: 'maze_reset'
    },
    on_finish: function() {
        curr_distractor_array = jsPsych.timelineVariable('values');
        curr_index = 0;
        questions_array = jsPsych.timelineVariable('questions');
        question_index = 0;
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
        data.data = jsPsych.timelineVariable('values')[curr_index]

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
        data.Story_num = jsPsych.timelineVariable('Story_num');
        data.Total_words = jsPsych.timelineVariable('Total_words');
    }
};


function key_check() {
    var data = jsPsych.data.get().last(1).values()[0];

    if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
            data.Target) &&
        data.response == "e") {
        curr_index++;
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
            data.Target) &&
        data.response == "i") {
        curr_index++;
        return false;
    } else {
        return true;
    }
};

var error_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<p style='color: red; font-size: 24pt;'>x</p>",
    choices: "NO_KEYS",
    trial_duration: 350,
    data: {
        trial1: "error"
    }
};

var if_node = {
    timeline: [error_trial],
    conditional_function: key_check
};

var variable_distractor_trials1 = {
    timeline: [maze_trial1, if_node],
    loop_function() {
        if (curr_index == curr_distractor_array.length) {
            return false;
        } else {
            return true;
        }
    }
};

var loop_node1 = {
    timeline: [variable_distractor_trials1],
    loop_function: key_check
};




// COMPREHENSION QUESTIONS

// as we are likely to have more than one comprehension question we need to use `timeline_variables` to go through our `maze_questions_1` stimuli
// note that it is not useful to do the error checking for the comprehension questions as we want to see if the participant actually chooses the correct answer

var comprehension_instructions = {
    type: jsPsychInstructions,
    data: {
        trial1: 'instructions'
    },
    pages: ["That is the end of the story.<br/><br/>You will now be asked a number of questions.<br/><br/>Press <b>'e'</b> if you think the correct answer is on the left and <b>'i'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

var comprehension_trial = {
    type: jsPsychMazeKeyboard,
    on_start: function(data) {
        var random1 = jsPsych.randomization.shuffle([
            jsPsych.timelineVariable('questions')[question_index].Target,
            jsPsych.timelineVariable('questions')[question_index].Distractor
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.prompt = jsPsych.timelineVariable('questions')[question_index].Question;

        data.data = jsPsych.timelineVariable('questions')[question_index]

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

        data.trial1 = "maze_comprehension";
        data.Story_num = jsPsych.timelineVariable('Story_num');

    }
};

var comprehension_trial_loop = {
    timeline: [comprehension_trial],
    loop_function() {
        question_index++;
        if (question_index == questions_array.length) {
            return false;
        } else {
            return true;
        }
    }
};




var maze_task_story_1 = {
    timeline: [maze_reset,
        loop_node1,
        comprehension_instructions,
        comprehension_trial_loop
    ],
    timeline_variables: mystimuli
};

timeline.push(maze_task_story_1);


jsPsych.run(timeline);
