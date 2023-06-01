library(tidyverse)
library(jsonlite)
library(here)

# natural_stories <- read_lines("~/Downloads/for_ibex.txt") %>%
#   as_tibble() %>%
#   mutate(value = str_remove_all(value, "\\["),
#          value = str_remove_all(value, "]")) %>%
#   separate(col = value, into = c("Story_num", "Sentence_num"), sep = ",", extra = "merge") %>%
#   separate(col = Sentence_num, into = c("Sentence_num", "Target"), sep = ", ", extra = "merge") %>%
#   separate(col = Target, into = c("Target", "Distractor"), sep = '", "', extra = "merge") %>%
#   mutate(Target = str_remove(Target, '"'),
#          Distractor = str_remove(Distractor, '",'))
# 
# write_csv(natural_stories, "~/Documents/GitHub/maze-jspsych/csv_to_javascript/natural_stories_maze_Boyce_Levy_2023.csv")





#--------------
#story stimuli
#--------------

#set the working directory to the folder where this located
setwd("~/Documents/GitHub/maze-jspsych/csv_to_javascript/")

here::here()

#read in csv file
natural_stories <- read_csv("original_csv/natural_stories_maze_Boyce_Levy_2023.csv")

#with the natural_stories data we need to apply several data processing steps so that it is in a usable format
#these are explained below

natural_stories_tidy <- natural_stories %>%
  select(-Distractor) %>% #drop the distractor column
  separate_rows(Target, sep = " ") %>% #convert words to rows based on the presence of a space/" ", this is like pivot_longer but applied to sentences
  group_by(Story_num, Sentence_num) %>% #now create extra column to identify word number for each story and sentence
  mutate(Word_num = 1:n()) %>% #word_num = 1 if it is the first word in a sentence, 2 if the second...
  ungroup() %>%
  left_join(natural_stories %>% # we will repeat the same process for our target stimuli and left_join the data together
              select(-Target) %>%
              separate_rows(Distractor, sep = " ") %>%
              group_by(Story_num, Sentence_num) %>%
              mutate(Word_num = 1:n()) %>%
              ungroup()) %>%
  mutate(Story_num = as.numeric(Story_num), #make sure Story_num and Sentence_num are numeric
         Sentence_num = as.numeric(Sentence_num)) %>%
  # filter(Sentence_num == 1) %>%
  group_by(Story_num) %>% #for each story we want to calculate the Word_tally and Total_words
  mutate(Word_tally = row_number(), #this is the sequential number of words in the story, like Word_num but not per sentence
         Total_words = max(Word_tally)) %>% #this is the total number of words in the story
  ungroup() %>%
  select(contains("_"), everything()) #reorder columns to make it look neat

#we should now have a tibble called natural_stories_tidy with 7 variables and 10,256 rows
#each row should have a Target and a Distractor column which will act as the input to the maze task
#all the other columns are used for data identification

#we now need to convert this tibble into a .js so that JsPsych can read it. This means it has to be in a JSON data format, which will look very different.
#there has to be a variable defined for each story, so that the experiment script can iterate through the trials.
#this means the format has to be:
#
#var maze_story_1 = [{...},{...}, ...];
#var maze_story_2 = [{...},{...}, ...];
#
#this will look something like this for every row in our natural_stories_tidy 
#
#{
#  "Story_num": 1,
#  "Sentence_num": 1,
#  "Word_num": 1,
#  "Word_tally": 1,
#  "Total_words": 1073,
#  "Target": "If",
#  "Distractor": "x-x-x"
#}

#as each story needs to be defined as a different variable, we will need to use a for loop to filter the data and convert it to a JSON format
#to convert the data to json format we use the jsonlite package and the toJSON function
#to convert everything to javascript we just paste together the text "var maze_story_", the number of the story, " = ", then the json formatted data, ";\n\n"
#the last bit of text is to just separate each of the stories, as this is a .js file there has to be ";" at the end of each declaration

#we will store all of this text in an object called story_all
#once the story has been formatted as a javascript var we will add it to this object
#the process repeats until we are left with all the stories being stored in the story_all object
story_all <- NULL

#here is the for loop
for (i in unique(natural_stories_tidy$Story_num)) {
  
  story_i <- paste0("var maze_story_",
                    i,
                    " = ",
                    toJSON(natural_stories_tidy %>%
                             filter(Story_num == i),
                           pretty = TRUE),
                    ";\n\n")
  
  story_all <<- paste0(story_all, story_i)

}

#we will now write this file so we have a .js version of our stimuli, which jspsych can read
write_file(x = story_all,
           file = paste0(here(), "/original_csv/natural_stories_maze_stimuli.js"))




#--------------
#question stimuli
#--------------

#we can repeat this process with the comprehension questions
#note we do not have to make anything in long format as we are not using a maze task here, just asking questions and presenting two possible answers

# natural_stories_questions <- read_lines("~/Downloads/ibex_questions.txt") %>%
#   as_tibble() %>%
#   mutate(value = str_remove_all(value, "\\["),
#          value = str_remove_all(value, "]")) %>%
#   separate(col = value, into = c("Story_num", "Question_num"), sep = ',', extra = "merge") %>%
#   separate(col = Question_num, into = c("Question_num", "Question"), sep = ',"', extra = "merge") %>%
#   separate(col = Question, into = c("Question", "Answer"), sep = ',"', extra = "merge") %>%
#   separate(col = Answer, into = c("Target", "Distractor"), sep = '","', extra = "merge") %>%
#   mutate(Question = str_remove(Question, '"'),
#          Target = str_remove(Target, '",'),
#          Distractor = str_remove(Distractor, '",'))
# 
# write_csv(natural_stories_questions, "natural_stories_questions_Boyce_Levy_2023.csv")

natural_stories_questions <- read_csv("original_csv/natural_stories_questions_Boyce_Levy_2023.csv")

questions_all <- NULL

for (i in unique(natural_stories_questions$Story_num)) {
  
  questions_i <- paste0("var maze_questions_",
                        i,
                        " = ",
                        toJSON(natural_stories_questions %>%
                                 filter(Story_num == i),
                               pretty = TRUE),
                        ";\n\n")
  
  questions_all <<- paste0(questions_all, questions_i)
  
}

write_file(x = questions_all,
           file = paste0(here(), "/output_js/maze_questions", ".js"))





#----------------
#jspsych variables
#----------------

#it is also quite efficient to use code to generate some our jspsych code
#for example if we have multiple stories we want to show then we will have to create 3 different variables for each story
#it is possible to copy, paste and edit this but humans make errors, so a script could save you time

#here we will paste together the jspsych code that makes the maze_task_story_i, comprehension_questions_i and maze_task_complete_i variables
#the i will simply represent the story number
#we can also create an additional variable that holds all the maze_task_complete_i variables as an array

maze_trials_all <- NULL
maze_trials_all1 <-  NULL

for (i in unique(natural_stories_tidy$Story_num)) {
  
  maze_trial_i <- paste0("var maze_task_story_", i, " = {
    timeline: [loop_node],
    timeline_variables: maze_story_", i,
"\n};\n\n",

"var comprehension_questions_", i, " = {
    timeline: [comprehension_trial],
    timeline_variables: maze_questions_", i,
"\n};\n\n",

"var maze_task_complete_", i, " = {
    timeline: [maze_task_story_", i, ", comprehension_instructions, comprehension_questions_", i, "]",
"\n};\n\n")
  
  maze_trials_all <<- paste0(maze_trials_all, maze_trial_i)

  
  
  maze_trial_i1 <- paste0("maze_task_complete_", i)
  
  maze_trials_all1 <<- paste0(maze_trials_all1, maze_trial_i1, ",\n")
  
}


#now we will paste everything together
maze_trials_all <- paste0(maze_trials_all,
                           "\n\nvar maze_story_all = [\n",
                           str_sub(maze_trials_all1, 1, -3),
                           "\n]")

#this object can be saved as .js file to be used in the jspsych experiment
write_file(x = maze_trials_all,
           file = paste0(here(), "/output_js/maze_trials", ".js"))




df1 <- data.frame(name = c("a", "b", "c"),
                  v = c(1, 2, 3),
                  w = c(10, 20, 30)) %>%
  group_by(name) %>%
  nest_legacy(.key = "Values1")

df2 <- data.frame(name = c("a", "b", "c"),
                  x = c(5, 10, 15),
                  y = c(100, 200, 300),
                  z = c(1000, 2000, 3000)) %>%
  group_by(name) %>%
  nest_legacy(.key = "Values2")

df3 <- df1 %>%
  left_join(df2)

natural_stories_tidy2 <- natural_stories_tidy1 %>%
  group_by(Story_num, Total_words) %>%
  filter(Sentence_num == 1,
         Word_num < 11) %>%
  nest_legacy(.key = "values")

json <- toJSON(natural_stories_tidy1, dataframe = "rows", pretty = TRUE)

natural_stories_questions1 <- natural_stories_questions %>%
  group_by(Story_num) %>%
  nest_legacy(.key = "questions")

natural_stories1 <- natural_stories_tidy2 %>%
  left_join(natural_stories_questions1)

json <- paste0("var maze_stimuli = ",
               toJSON(natural_stories1 %>%
                 filter(Story_num < 3),
               dataframe = "rows",
               pretty = TRUE))

json %>%
  write_file(paste0("/Users/james/Documents/GitHub/maze-jspsych/maze_4_choices/stimuli/maze_trials", ".js"))

library(stringi)

natural_stories_tidy1 <- natural_stories_tidy %>%
  mutate(Target1 = stri_rand_shuffle(Target),
         Target1 = ifelse(Target1 == Target,
                          stri_rand_shuffle(paste0(
                            Target,
                            stri_rand_strings(n = 1, length = 2, pattern = "[a-z]"))),
                          Target1),
         Target1 = str_remove_all(Target1, "\\,|\\.|\\!|\\?|\\'"),
         Target1 = ifelse(str_ends(Target, "\\,|\\.|\\!|\\?|\\'"), paste0(Target1, str_sub(Target, -1, -1)), Target1),
         Target1 = tolower(Target1),
         Target1 = ifelse(str_length(Target1) < 3, stri_rand_shuffle(paste0(
           Target1,
           sample(letters, sample(c(1, 2), 1)))),
           Target1),
         real_word1 = ifelse(Target1 %in% GradyAugmented, 1, 0),
         Target1 = ifelse(real_word1 == 1, stri_rand_shuffle(paste0(
           Target1,
           sample(letters, sample(c(1, 2), 1)))),
           Target1),
         Target1 = ifelse(str_starts(Target, "[A-Z]"), str_to_title(Target1), Target1),
         Target1 = ifelse(Word_num == 1, "x-x-x", Target1)
         ) %>%
  mutate(Distractor1 = stri_rand_shuffle(Distractor),
         Distractor1 = ifelse(Distractor1 == Distractor,
                          stri_rand_shuffle(paste0(
                            Distractor,
                            stri_rand_strings(n = 1, length = 2, pattern = "[a-z]"))),
                          Distractor1),
         Distractor1 = str_remove_all(Distractor1, "\\,|\\.|\\!|\\?|\\'"),
         Distractor1 = ifelse(str_ends(Distractor, "\\,|\\.|\\!|\\?|\\'"), paste0(Distractor1, str_sub(Distractor, -1, -1)), Distractor1),
         Distractor1 = tolower(Distractor1),
         Distractor1 = ifelse(str_length(Distractor1) < 3, stri_rand_shuffle(paste0(
           Distractor1,
           sample(letters, sample(c(1, 2), 1)))),
           Distractor1),
         real_word1 = ifelse(Distractor1 %in% GradyAugmented, 1, 0),
         Distractor1 = ifelse(real_word1 == 1, stri_rand_shuffle(paste0(
           Distractor1,
           sample(letters, sample(c(1, 2), 1)))),
           Distractor1),
         Distractor1 = ifelse(str_starts(Distractor, "[A-Z]"), str_to_title(Distractor1), Distractor1),
         Distractor1 = ifelse(Word_num == 1, "x-x-x", Distractor1)
  ) %>%
  mutate(real_word1 = ifelse(Target1 %in% GradyAugmented, 1, 0),
         Target1 = ifelse(real_word1 == 1, str_remove(Target1, "a|e|i|o|u"), Target1),
         length_diff1 = str_length(Target) - str_length(Target1),
         real_word2 = ifelse(Distractor1 %in% GradyAugmented, 1, 0),
         Distractor1 = ifelse(real_word2 == 1, str_remove(Distractor1, "a|e|i|o|u"), Distractor1),
         length_diff2 = str_length(Distractor) - str_length(Distractor1),
         real_word1 = ifelse(Target1 %in% GradyAugmented, 1, 0),
         real_word2 = ifelse(Distractor1 %in% GradyAugmented, 1, 0),
         Target1 = ifelse(real_word1 == 1, stri_rand_shuffle(paste0(
           Target1,
           sample(letters, sample(c(1, 2), 1)))), Target1)
         ) %>%
  select(-real_word1, -length_diff1, -real_word2, -length_diff2) %>%
  rename(Distractor3 = Distractor1,
         Distractor2 = Target1,
         Distractor1 = Distractor)

%>%
  View()

library(qdapDictionaries)

GradyAugmented %>%
  as_tibble() %>%
  nrow()
  slice(1:10)
  View()

stri_reverse("abc")
