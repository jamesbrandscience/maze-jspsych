library(tidyverse)
library(jsonlite)

natural_stories <- read_lines("~/Downloads/for_ibex.txt") %>%
  as_tibble() %>%
  mutate(value = str_remove_all(value, "\\["),
         value = str_remove_all(value, "]")) %>%
  separate(col = value, into = c("Story_num", "Sentence_num"), sep = ",", extra = "merge") %>%
  separate(col = Sentence_num, into = c("Sentence_num", "Target"), sep = ", ", extra = "merge") %>%
  separate(col = Target, into = c("Target", "Distractor"), sep = '", "', extra = "merge") %>%
  mutate(Target = str_remove(Target, '"'),
         Distractor = str_remove(Distractor, '",'))

write_csv(natural_stories, "~/Documents/GitHub/maze-jspsych/csv_to_javascript/natural_stories_maze_Boyce_Levy_2023.csv")


#read in csv file
here()

natural_stories <- read_csv(paste0("~", here(), "/natural_stories_maze_Boyce_Levy_2023.csv"))

natural_stories1 <- natural_stories %>%
  select(-Distractor) %>%
  separate_rows(Target, sep = " ") %>%
  group_by(Story_num, Sentence_num) %>%
  mutate(Word_num = 1:n()) %>%
  ungroup() %>%
  left_join(natural_stories %>%
              select(-Target) %>%
              separate_rows(Distractor, sep = " ") %>%
              group_by(Story_num, Sentence_num) %>%
              mutate(Word_num = 1:n()) %>%
              ungroup()) %>%
  mutate(Story_num = as.numeric(Story_num),
         Sentence_num = as.numeric(Sentence_num)) %>%
  # filter(Sentence_num == 1) %>%
  group_by(Story_num) %>%
  mutate(Word_tally = row_number(),
         Total_words = max(Word_tally)) %>%
  ungroup() %>%
  select(contains("_"), everything())

maze1a <- NULL

for (i in unique(natural_stories1$Story_num)) {
  
  maze1 <- paste0("var ",
               paste0("maze_story_", i),
               " = ",
               toJSON(natural_stories1 %>%
                        filter(Story_num == i),
                      pretty = TRUE),
               ";\n\n")
  
  maze1a <<- paste0(maze1a, maze1)

}

write_file(x = maze1a,
           file = "~/Documents/GitHub/maze-jspsych/csv_to_javascript/maze_story_stimuli.js")





natural_stories_questions <- read_lines("~/Downloads/ibex_questions.txt") %>%
  as_tibble() %>%
  mutate(value = str_remove_all(value, "\\["),
         value = str_remove_all(value, "]")) %>%
  separate(col = value, into = c("Story_num", "Question_num"), sep = ',', extra = "merge") %>%
  separate(col = Question_num, into = c("Question_num", "Question"), sep = ',"', extra = "merge") %>%
  separate(col = Question, into = c("Question", "Answer"), sep = ',"', extra = "merge") %>%
  separate(col = Answer, into = c("Answer1", "Answer2"), sep = '","', extra = "merge") %>%
  mutate(Question = str_remove(Question, '"'),
         Answer1 = str_remove(Answer1, '",'),
         Answer2 = str_remove(Answer2, '",')) %>%
  filter(Question_num == 1)

maze1a <- NULL

for (i in unique(natural_stories_questions$Story_num)) {
  
  maze1 <- paste0("var ",
                  paste0("maze_questions_", i),
                  " = ",
                  toJSON(natural_stories_questions %>%
                           filter(Story_num == i),
                         pretty = TRUE),
                  ";\n\n")
  
  maze1a <<- paste0(maze1a, maze1)
  
  
  write_file(x = maze1a, file = paste0("~/Downloads/maze_questions", ".js"))
  
}

