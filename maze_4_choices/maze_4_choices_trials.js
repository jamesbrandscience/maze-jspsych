// ----------------
// SET UP JSPSYCH
// ----------------

// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format
var jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData("csv");
    }
});

// ------------------
// MAZE TRIALS
// ------------------

// in the follow sections we will use code to generate the following key components of our maze experiment
// instructions page
// maze reset
// maze trial
// correct key check
// error trial and loop
// trial counter

// -----------------
// INSTRUCTIONS

// this trial uses the jsPsychInstructions plugin
// it will present the html formatted text in the pages argument
// this is just an example page so that you can see how an instructions page looks, the text is based on https://github.com/vboyce/natural-stories-maze/blob/master/Materials/for_ns.js which was used by Boyce and Levy (2023)
var main_instructions = {
    type: jsPsychInstructions,
    data: {
        trial1: 'instructions'
    },
    pages: ["<div style='text-align: center; margin-right: 150px; margin-left: 150px;'><b>maze-jspsych example</b><br/><br/><p>For this experiment, please place your fingers in the following way:<br/><br/>left index finger on the <b>'c'</b> key<br/>left middle finger on the <b>'d'</b> key<br/>right index finger on the <b>'r'</b> key.<br/>right middle finger on the <b>'g'</b> key</p><p> You will read sentences word by word. On each screen you will see four options: one will be the next word in the sentence, and all the others will not.<br/><br/>Select the word that continues the sentence by pressing the keys in that follow this rule:<br/><br/> bottom option = <b>'c'</b> (left-hand, index finger)<br/>left option = <b>'d'</b> (left-hand, middle finger)<br/>top option = <b>'r'</b> (right-hand, index finger)<br/>right option = <b>'g'</b> (right-hand, middle finger)</p><p>Select the best word as quickly as you can, but without making too many errors.</p></div>"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

// ------------------
// MAZE RESET

// as our mazes are nested in the data, we need to set up a way to keep track of which items are being displayed
// our stimuli should be presented in order, i.e. see the first target/distractors, then move on to the next ones in the sentence
// this is set up in the maze_stimuli.js file, with our stimuli stored as a variable called maze_stimuli
// as we have multiple sentences/stories to present, we want to be able to iterate through the items, but also reset that counter once we have finished, so it resets for the next sentence/story
// to do this we can create a reset trial

// this is just a keyboard response trial, but the duration is set to 0, so we do not actually see it in the experiment
// the important part of this code is the on_finish part, where we can get the values part from our stimuli, which contains all the trial information for the sentences/stories
var curr_distractor_array, curr_index;

var maze_reset = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: " ",
    choices: "NO_KEYS",
    trial_duration: 0,
    data: {
        trial1: 'maze_reset'
    },
    on_finish: function() {
        maze_trial_values = jsPsych.timelineVariable('values');
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
            jsPsych.timelineVariable('values')[curr_index].Distractor1,
            jsPsych.timelineVariable('values')[curr_index].Distractor2,
            jsPsych.timelineVariable('values')[curr_index].Distractor3
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.stimulus_top = random1[2];
        data.stimulus_bottom = random1[3];

        data.data = jsPsych.timelineVariable('values')[curr_index]

    },
    choices: ["d", "c", "r", "g"],
    on_finish: function() {

        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == "d") {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == "g") {
            data.correct = 1;
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_top,
                data.Target) &&
            data.response == "r") {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_bottom,
                data.Target) &&
            data.response == "c") {
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
        data.response == "d") {
        curr_index++;
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
            data.Target) &&
        data.response == "g") {
        curr_index++;
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_top,
            data.Target) &&
        data.response == "r") {
        curr_index++;
        return false;
    } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_bottom,
            data.Target) &&
        data.response == "c") {
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
    pages: ["That is the end of the story.<br/><br/>You will now be asked a number of questions.<br/><br/>Press <b>'d'</b> if you think the correct answer is on the left and <b>'g'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

var comprehension_trial = {
    type: jsPsychMazeQuestion,
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
    choices: ["d", "g"],
    on_finish: function() {
        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == "d") {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == "g") {
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


// ---------------
// TIMELINE
// ---------------

// we first have to establish a timeline, which we will use to push the different trials todo
// this starts off as an empty array, as indicated by the empty square brackets []
var timeline = [];

// next we will use the timeline.push function to push the different trials to our timeline
// this looks a bit repetitive, but when troubleshooting our experiment, we can just comment out different trials and test to see the trials we want
// remember that the order you push trials to the timeline matters, so we will have main_instructions as the first trial and then our maze_task_story_1 trial
timeline.push(main_instructions);
timeline.push(maze_task_story_1);

// ----------------
// RUN THE EXPERIMENT
// ----------------

// now we can run the experiment using the jsPysch.run function, we specify that our timeline array is what we want to run
jsPsych.run(timeline);
