[Reinforz](#reinforz)

  + [Featurs](#featurs)
  + [Pages](#pages)
    - [Home](#home)
      - [Upload](#upload)
      - [ErrorLogs](#errorlogs)
      - [Uploaded List](#uploaded-list)
      - [PlayTables](#playtables)
    - [PlaySettings](#playsettings)
    - [Game](#game)
    - [Stats](#stats)
      - [Question](#question)
      - [Answers/Options](#answersoptions)
    - [Report](#report)
      - [ReportFilter](#reportfilter)
      - [ReportTable](#reporttable)
      - [ReportExport](#reportexport)
    - [Settings](#settings)
  + [Conventions](#conventions)

# Reinforz

Force yourself to master a topic through continuous feedback

## Features

01. Easy to understand and create schema
02. Works completely offline as at the moment it's only coupled with any database
03. Automatic Question Data inferation
04. Tracking quiz performance
05. Built in Static code editor for Code format questions
06. Supports JSON and YAML files for Quiz Schema
07. Filters and Tables added to extract the required data

## Pages

### Home

<img src="https://github.com/Devorein/reinforz/blob/master/docs/Home.png">

#### Upload

This is used to upload quizzes, either drag and drop on the region or click to select files. Only JSON and YAML files are supported at the moment

#### ErrorLogs

This list shows all the errors and warnings found while parsing the quizzes uploaded.

Parts of the ErrorLogs items:

01. Quiz name where it was found
02. the question number
03. level of error
04. the actual error

Levels of Errors

01. WARN: Yello box, indicates that the question had problematic schema, but the parser was able to transform the data. Please update the warned regions of the question and upload the quiz again.
02. ERROR: Red box, indicates that the question had problematic schema, and the parser was not able to transform the data. Please update the error regions of the question and upload the quiz again.

#### Uploaded List

This list contains all the uploaded quizzes and a bit of information regarding the number of questions of the quiz. You can remove any/all of the quizzes and only the checked quizzes can be played.

#### PlayTables

Three tables containing information about the questions of the uploaded quizzes.

01. Difficulty Based Table: Shows the number of questions based on its difficulty
02. Type Based Table: Shows the number of questions based on its type
03. Time Allocated Based Table: Shows the number of questions based on its time allocated

#### PlaySettings

Contains Two parts:

01. Options: Used to configure the game related settings

   1. Shuffle Options: If enabled, shuffles the options of the questions
   2. Shuffle Quizzes: If enabled, shuffles the order of the quizzes, but doesnt change the order of the question, by default it respects the upload order or selected order
   3. Shuffle Questions: If enabled, shuffles the order of the questions for each quiz, without changing the order of the quiz itself
   4. Instant Feedback: If enabled, shows the total correct after completing each question
   5. Flatten Mix: If enabled, completely shuffles all the questions and quizzes, without respecting the order of any of them. Checking this disables the Shuffle Quizzes and Shuffle Questions options as they will be shuffled in this mode.

02. Filters: Used to filter the uploaded quizzes questions based on various criterias

   1. Time allocated: Filters the questions whose time_allocated are within this time range
   2. Excluded Difficulty: Excludes questions based on its difficulty.
   3. Excluded Type: Excludes questions based on its type.

Workflow:

01. Upload quiz and questions after creating appropriate schema
02. Select the quizzes to be played
03. Filter the questions based on various criteria
04. At the end of it, atleast one question must be selected to play the quiz

### Game

This page is the main page where you play the quiz.

#### Stats

Contains stats regarding the current question, including:-

01. Quiz title
02. Quiz subject
03. Total correct
04. Current Question
05. Total Questions
06. Type of the question
07. Format of the question
08. Weight of the question
09. Time allocated for the question
10. Difficulty of the question

#### Question

The question container which changes based on the type of question

Question is created based on the following rules:

01. For format Code questions, a text highlighter, syntax highlighted through prism is displayed

   1. For FIB, the blanks are embedded directly in the question code
   2. For other types just a simple syntax highlighter is used

02. If its text formatted no text highlighter is used  

   1. For FIB, the blanks are embedded directly in the question text
   2. For other types just a question is displayed

#### Answers/Options

01. For MS and MCQ types all the options are displayed
02. For Snippet type a textfield is shown to type the answer

### Report 

#### ReportFilter

The report table rows can be filtered based on various criterias.

01. time taken: Filters the questions whose time taken are within this time range
02. Excluded Difficulty: Excludes questions based on its difficulty.
03. Excluded Type: Excludes questions based on its type.
04. Verdict: Filter the question verdict
05.  Excluded Quiz: Filter to remove report for questions for certain quizzes 
06.  Excluded Columns: Columns to remove from the ReportTable  

#### ReportTable

Each row of report table contains information about your performance in a specific question

#### ReportExport

The report and actual questions can be exported as YAML or JSON files

### Settings

Animation, Sounds, Hovertips and Theme can be changed on settings page

Feel free to create a new PR for any new features, or raise an issue for fixing any bug or for a new featue suggestion

### Conventions

01. A single file can contain only one quiz
02. Please try to name the file as Quiz_Subject - Quiz_Title, so that it becomes easier to maintain
