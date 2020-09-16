# Reinforz

Force yourself to master a topic through continuous feedback 

## Features

1. Easy to understand and create schema
2. Works completely offline as at the moment it's only coupled with any database
3. Automatic Question Data inferation
4. Tracking quiz performance
5. Built in Static code editor for Code format questions
6. Supports JSON and YAML files for Quiz Schema
7. Filters and Tables added to extract the required data

## Pages

### Home

<img src="https://github.com/Devorein/reinforz/blob/master/docs/Home.png">

#### Upload

This is used to upload quizzes, either drag and drop on the region or click to select files. Only JSON and YAML files are supported at the moment

#### ErrorLogs

This list shows all the errors and warnings found while parsing the quizzes uploaded.

Parts of the ErrorLogs items:

1. Quiz name where it was found
2. the question number
3. level of error
4. the actual error

Levels of Errors

1. WARN: Yello box, indicates that the question had problematic schema, but the parser was able to transform the data. Please update the warned regions of the question and upload the quiz again.
2. ERROR: Red box, indicates that the question had problematic schema, and the parser was not able to transform the data. Please update the error regions of the question and upload the quiz again.

#### Uploaded List

This list contains all the uploaded quizzes and a bit of information regarding the number of questions of the quiz. You can remove any/all of the quizzes and only the checked quizzes can be played.

#### PlayTables

Three tables containing information about the questions of the uploaded quizzes.

1. Difficulty Based Table: Shows the number of questions based on its difficulty
2. Type Based Table: Shows the number of questions based on its type
3. Time Allocated Based Table: Shows the number of questions based on its time allocated

#### PlaySettings

Contains Two parts:

1. Options: Used to configure the game related settings

   1. Shuffle Options: If enabled, shuffles the options of the questions
   2. Shuffle Quizzes: If enabled, shuffles the order of the quizzes, but doesnt change the order of the question, by default it respects the upload order or selected order
   3. Shuffle Questions: If enabled, shuffles the order of the questions for each quiz, without changing the order of the quiz itself
   4. Instant Feedback: If enabled, shows the total correct after completing each question
   5. Flatten Mix: If enabled, completely shuffles all the questions and quizzes, without respecting the order of any of them. Checking this disables the Shuffle Quizzes and Shuffle Questions options as they will be shuffled in this mode.

2. Filters: Used to filter the uploaded quizzes questions based on various criterias

   1. Time allocated: Filters the questions whose time_allocated are within this time range
   2. Excluded Difficulty: Excludes questions based on its difficulty.
   2. Excluded Type: Excludes questions based on its type.
