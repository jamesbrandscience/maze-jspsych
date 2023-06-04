// ----------------
// SET UP JSPSYCH
// ----------------

// this is a very basic set up and you can modify as needed, it will display the results at the end of the experimet in a csv format
var jsPsych = initJsPsych({
    on_finish: function() {
        jsPsych.data.displayData("csv");
    }
});

var left_key = "d";
var up_key = "r";
var right_key = "g";
var down_key = "c";

var error_message = "<p style='color: red; font-size: 24pt;'>x</p>";


// ------------------
// MAZE TRIALS
// ------------------

// in the follow sections we will use code to generate the following key components of our maze experiment
// instructions page
// maze reset
// maze trial
// correct key check
// error trial
// complete maze

// -----------------
// INSTRUCTIONS

// this trial uses the jsPsychInstructions plugin
// it will present the html formatted text in the pages argument
// this is just an example page so that you can see how an instructions page looks, the text is based on https://github.com/vboyce/natural-stories-maze/blob/master/Materials/for_ns.js which was used by Boyce and Levy (2023)
var main_instructions_text = "<div style='text-align: center; margin-right: 150px; margin-left: 150px;'><b>maze-jspsych example</b><br/><br/><p>For this experiment, please place your fingers in the following way:<br/><br/>left index finger on the <b>'"+down_key+"'</b> key<br/>left middle finger on the <b>'"+left_key+"'</b> key<br/>right index finger on the <b>'"+up_key+"'</b> key.<br/>right middle finger on the <b>'"+right_key+"'</b> key</p><p> You will read sentences word by word. On each screen you will see four options: one will be the next word in the sentence, and all the others will not.<br/><br/>Select the word that continues the sentence by pressing the keys in that follow this rule:<br/><br/> bottom option = <b>'"+down_key+"'</b> (left-hand, index finger)<br/>left option = <b>'"+left_key+"'</b> (left-hand, middle finger)<br/>top option = <b>'"+up_key+"'</b> (right-hand, index finger)<br/>right option = <b>'"+right_key+"'</b> (right-hand, middle finger)</p><p>Select the best word as quickly as you can, but without making too many errors.</p></div>";

var main_instructions = {
    type: jsPsychInstructions,
    data: {
        trial1: 'instructions'
    },
    pages: [main_instructions_text],
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

// the important part of this code is the on_finish part, where we can get the important trial level values from our stimuli
// the maze_array variable will store the 'values' part of our timeline variable, which will be defined later
// for each of our experimental stimuli, i.e. each story/sentence, there is trial level information for the target and distractor items
// to keep track of which item should be presented, we make a variable called maze_index, which starts at 0 (the first item)
// we will also create variables for our comprehension questions, following the same idea, questions_array contains the 'questions' data and question_index is 0

// which contains all the trial information for the sentences/stories, this information is stored as a variable called maze_trial_values and will contain the values from our timeline variable - maze_stimuli
// we will also do this for our comprehension questions, which are stored in the variable questions_array, with all the questions values contained in the questions
// note that we randomise the order of the questions, this is done with jsPsych.randomization.shuffle
// randomising the order of the questions ensures that there is no order effects, i.e. everybody having the same questions presented in the same order

// later on we will increase the values of maze_index and question_index after each trial has been completed, i.e. after the participant chooses the target word or gives a response to a question

var maze_reset = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    choices: "NO_KEYS",
    trial_duration: 0,
    data: {
        trial1: 'maze_reset'
    },
    on_finish: function() {
        maze_array = jsPsych.timelineVariable('values');
        maze_index = 0;
        questions_array = jsPsych.randomization.shuffle(jsPsych.timelineVariable('questions'));
        question_index = 0;
    }
};

// ---------------
// MAZE TRIAL

// this is the code for the actual maze trial, i.e. where the participant sees the array of target and distractor on the screen
// we can look at each of the components in this trial separately

// type -------------
// here we use the jsPsychMazeKeyboard, which is defined in the plugins folder using the plugin-maze-keyboard.js file
// this plugin needs 4 items, which are displayed in a diamond configuation, left, right, top, bottom
// the participant will see the items and press a key that relates to one of the positions

// prompt -------------
// here we show a progress bar for the participant, so that they can see how far into the story/sentence they are
// we use the jsPsych.timelineVariable('values')[maze_index].Word_num to get the index of which trial they are seeing, i.e. Word_num in our data
// this value is coded incrementally, i.e. 1, 2, 3, 4, 5
// we also use the jsPsych.timelineVariable('values')[maze_index].Total_words to get the maximum number of words in the story/sentence, this is again coded in our data but is constant for each story/sentence, i.e. every trial for a specific story/sentence has a set Word_num based on how many trials there are

// on_start -------------
// this is where we specify the words to be presented on the screen
// the variable random1 takes the target and distractor items from our data for each trial, i.e. jsPsych.timelineVariable('values')[maze_index]
// we use the jsPsych.randomization.shuffle function to shuffle the location of our items
// then we can define which item is located in either the left, right, top or bottom location, by using the index 0/1/2/3 on our random1 variable
// e.g. if our items are [target_word, distractor_word1, distractor_word2, distractor_word3]
// we first shuffle that array to get [distractor_word1, distractor_word3, target_word, distractor_word2]
// then we assign these items to the locations so stimulus_left = distractor_word1, stimulus_right = distractor_word3, stimulus_top = target_word, stimulus_bottom = distractor_word2
// this process is repeated every time the trial is displayed, so each participant will see a random order
// note that this randomisation also happens when a participant gets the response wrong, and has to redo the trial
//  we also store all the values in our data so that we can have them in our csv file, i.e. we have columns for Word_num, Target, Distractor1 etc., which is done using the data.data = jsPsych.timelineVariable('values')[maze_index]

// choices --------------
// these are the keys that we will allow as responses for the trial
// these are defined at the top of this script

// on_finish --------------
// here we will classify whether the participant has chosen the target word or not
// we first make a variable called data and store the data generated from the trial using jsPsych.data.get().last(1).values()[0];
// then we use if else statements to check if the participant chose the target, if the participant was correct we assign a 1 to a variable called correct, if they were not correct, then correct will be 0
// i.e. if the target word was in the left position and the participant pressed the left_key, correct = 1

var maze_trial = {
    type: jsPsychMazeKeyboard,
    prompt: function() {

        var progress_bar = '<relative><progress id="progress_bar" value="' +
            jsPsych.timelineVariable('values')[maze_index].Word_num +
            '" max="' +
            jsPsych.timelineVariable("Total_words") +
            '"></progress></relative>';

        return progress_bar;
    },
    on_start: function(data) {

        var random1 = jsPsych.randomization.shuffle([
            jsPsych.timelineVariable('values')[maze_index].Target,
            jsPsych.timelineVariable('values')[maze_index].Distractor1,
            jsPsych.timelineVariable('values')[maze_index].Distractor2,
            jsPsych.timelineVariable('values')[maze_index].Distractor3
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];
        data.stimulus_top = random1[2];
        data.stimulus_bottom = random1[3];

        data.data = jsPsych.timelineVariable('values')[maze_index]

    },
    choices: [left_key, right_key, up_key, down_key],
    on_finish: function() {

        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == left_key) {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == right_key) {
            data.correct = 1;
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_top,
                data.Target) &&
            data.response == up_key) {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_bottom,
                data.Target) &&
            data.response == down_key) {
            data.correct = 1;
        } else {
            data.correct = 0;
        };

        data.trial1 = "maze";
        data.Story_num = jsPsych.timelineVariable('Story_num');
        data.Total_words = jsPsych.timelineVariable('Total_words');
    }
};


var maze_trial1 = {
    type: jsPsychMazeKeyboard,
    prompt: function() {

        var progress_bar = '<relative><progress id="progress_bar" value="' +
            jsPsych.timelineVariable('values')[maze_index].Word_num +
            '" max="' +
            jsPsych.timelineVariable("Total_words") +
            '"></progress></relative>';

        return progress_bar;
    },
    on_start: function(data) {

      var data1 = jsPsych.data.get().last(1).values()[0];

        data.stimulus_left = data1.stimulus_left;
        data.stimulus_right = data1.stimulus_right;
        data.stimulus_top = data1.stimulus_top;
        data.stimulus_bottom = data1.stimulus_bottom;

        data.data = jsPsych.timelineVariable('values')[maze_index]

    },
    choices: [left_key, right_key, up_key, down_key],
    on_finish: function() {

        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == left_key) {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == right_key) {
            data.correct = 1;
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_top,
                data.Target) &&
            data.response == up_key) {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_bottom,
                data.Target) &&
            data.response == down_key) {
            data.correct = 1;
        } else {
            data.correct = 0;
        };

        data.trial1 = "maze";
        data.Story_num = jsPsych.timelineVariable('Story_num');
        data.Total_words = jsPsych.timelineVariable('Total_words');
    }
};


// ---------------
// CORRECT KEY CHECK

// we can now set up a function that checks whether the participant was correct or not
// we will call this key_check
// it will again get the data generated from the maze_trial and if correct == 1, we can increase the maze_index by 1, using maze_index++
// we also use retun false, as this means that the participant was correct and they do not have to repeat the trial
// if the participant was not correct, i.e. correct does not equal 1, then we return true, which indicates they should repeat the trial
// these return true/false statements will make more sense in the 'if_node' described below

function key_check() {
    var data = jsPsych.data.get().last(1).values()[0];

    if (data.correct == 1) {
        maze_index++;
        return false;
    } else {
        return true;
    }
};

// -------------
// ERROR TRIAL

// if the participant did not chose the target word, we want to show a message on the screen so that they can get feedback that their response was not correct
// we create a trial to show the participant this called error_trial
// it will simply show the error message that we defined at the top of this script, i.e. a red 'x'
// we show this for 350ms

// now we can create a conditional trial where the error_trial is only shown if the participant was not correct
// this is done by defining the if_node, where the conditional_function is our key_check
// if key_check returns true, then we show the error_trial
// if key_check returns false, then we do not show the error_trial

var error_trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: error_message,
    choices: "NO_KEYS",
    trial_duration: 350,
    data: {
        trial1: "error"
    }
};

var if_node = {
    timeline: [error_trial, maze_trial1],
    conditional_function: key_check
};

// ---------------------
// COMPLETE MAZE TRIAL

// we can now put everything together to make a complete maze trial
// our timeline will comprise the maze_trial followed by the if_node

// importantly, we will also use a loop function
// this function will mean we iterate through the trials in our story/sentence until the last item has been displayed
var complete_maze_trial = {
    timeline: [maze_trial, if_node],
    loop_function() {
        if (maze_index == maze_array.length) {
            return false;
        } else {
            return true;
        }
    }
};


// ------------------
// COMPREHENSION QUESTIONS
// ------------------

// once a participant has read the story/sentence, we would check that they have understood what they have read using comprehension questions
// first we will present an instructions page, as the instructions are a little different from the maze trials
// the main question section will be similar to the maze trial in that they have to choose between a target answer and distractor by pressing a key
// we will present two words, one on the left and one of the right, with the question located above the choices
// note that it is not useful to do the error loop for the comprehension questions as we want to see if the participant actually chooses the correct answer

// ----------------
// COMPREHENSION QUESTION INSTRUCTIONS

// this is similar to the maze instructions but the text is different
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

// -------------------
// COMPRENHENSIOM QUESTION TRIALS

// we use the jsPsychMazeQuestion plugin here
// again this trial is similar to the maze trial
// we first shuffle the target and distractor
// then assign them to either the left or the right location
// we also add a prompt, this contains the question text and is positioned above the choices
// we check to see if the participant was correct and code the response in the correct variable, where 1 = correct, 0 = not correct
var comprehension_trial = {
    type: jsPsychMazeQuestion,
    on_start: function(data) {

        var random1 = jsPsych.randomization.shuffle([
            questions_array[question_index].Target,
            questions_array[question_index].Distractor
        ]);

        data.stimulus_left = random1[0];
        data.stimulus_right = random1[1];

        data.prompt = questions_array[question_index].Question;

        data.data = questions_array[question_index]

    },
    choices: [left_key, right_key],
    on_finish: function() {
        var data = jsPsych.data.get().last(1).values()[0];

        if (jsPsych.pluginAPI.compareKeys(data.stimulus_left,
                data.Target) &&
            data.response == left_key) {
            data.correct = 1
        } else if (jsPsych.pluginAPI.compareKeys(data.stimulus_right,
                data.Target) &&
            data.response == right_key) {
            data.correct = 1;
        } else {
            data.correct = 0;
        };

        data.trial1 = "maze_comprehension";
        data.Story_num = jsPsych.timelineVariable('Story_num');

    }
};

// --------------------
// COMPLETE COMPREHENSION QUESTION TRIAL

// as we need to loop through the questions, we
var complete_comprehension_trial = {
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

// ----------------
// NEW MAZE PROCEED
// ----------------

// as the participant will finish the comprehension questions and move on to the next maze, we will want to make sure they can have a small pause and signal that a new maze will start
// to do this we will create a trial letting the participant know that the next maze will begin when they are ready

var proceed_trial = {
    type: jsPsychInstructions,
    data: {
        trial1: 'proceed'
    },
    pages: ["That is the end of the questions.<br/><br/>Press the 'next' button to continue. Then place your fingers back on the keys."],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

// -----------------
// COMPLETE MAZE AND COMPREHENSION TRIALS
// -----------------

// now we have both the maze and comprehension questions set up we can make a variable called maze_task_story
// this will contain the maze_reset, complete_maze_trial, comprehension_instructions, complete_comprehension_trial together
// this timeline is the basis of our experiment
// we use maze_stimuli as our timeline variable as this contains all of our stimuli
var maze_task_story = {
    timeline: [maze_reset,
        complete_maze_trial,
        comprehension_instructions,
        complete_comprehension_trial,
        proceed_trial
    ],
    timeline_variables: maze_stimuli
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
timeline.push(maze_task_story);

// ----------------
// RUN THE EXPERIMENT
// ----------------

// now we can run the experiment using the jsPysch.run function, we specify that our timeline array is what we want to run
jsPsych.run(timeline);
