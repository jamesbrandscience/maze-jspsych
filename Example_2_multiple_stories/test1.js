// --------------
// MULTIPLE STORIES
// --------------

// to add extra stories to your experiment, you can reuse the code, but changing the var names and the timeline variables/timeline
// on line 163, we created `maze_task_story_1`, which had `maze_story_1` as the timeline variable
// in our stimuli folder, there is now a new variable called `maze_story_2`, which contains a new story, this is located in `maze_story_stimuli.js`
// we can use `maze_story_2` as the timeline variable and call the var `maze_task_story_2`

var maze_task_story_2 = {
    timeline: [loop_node],
    timeline_variables: maze_story_2
};

// we can do the same for our comprehension questions, where we use `maze_questions_2` as the timeline variable
// the new questions are in the stimuli folder in `maze_comprehension_stimuli.js`

var comprehension_questions_2 = {
    timeline: [comprehension_trial],
    timeline_variables: maze_questions_2
};

// now we put everything into a new var called `maze_task_complete_2`

var maze_task_complete_2 = {
    timeline: [maze_task_story_2, comprehension_instructions, comprehension_questions_2]
};

// if you have lots of stories and do not want to manually copy, paste and then change the values of the timeline variables, see the `maze_stimuli_create.R` script which will do this for all your stimuli


// we now create an instructions page to separate the end of the comprehension questions and the start of the next story

var next_story_instructions = {
    type: jsPsychInstructions,
    data: { trial1: 'instructions'},
    pages: ["We will now move on to the next story. Feel free to take a short rest.<br/><br/>Press <b>'e'</b> if you think the correct answer is on the left and <b>'i'</b> if you think the correct answer is on the right"],
    show_clickable_nav: true,
    allow_backward: false,
    allow_keys: false
};

// we push both `maze_task_complete_1` and `maze_task_complete_2` to our timeline

var timeline = [];

timeline.push(maze_task_complete_1,
              next_story_instructions,
              maze_task_complete_2);


// how do I randomise the order of the stories?

// if you want to show stories in a random order, you can use the following code to replace the code between lines 288-296
// it will use the `jspsych.randomisation.shuffle` function to randomly shuffle the stories
// this shuffled array is stored in `stories`
// we can the use `stories[0]` and `stories[1]` which will represent the first and second values in the shuffled array (javascript uses 0 to index the first object, and 1 to index the second)


var timeline = [];

var stories = jsPsych.randomization.shuffle([
  maze_task_complete_1,
  maze_task_complete_2]);

timeline.push(stories[0],
              next_story_instructions,
              stories[1]);



jsPsych.run(timeline);
