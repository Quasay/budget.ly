# Budget.ly Web Application

## Introduction

Welcome to the second application I designed and developed! 

This application is built off barebones JavaScript, HTML, & CSS without the use of any frameworks. My main goals for this project is to focus on the UI/UX and implement a rather complex system architecture on my own. The idea for the project itself came from a course I was taking, and I applied my own design decisions both on the front and back-end of the app.   

## User Interface 

The main aim I had for the User Interface of this application was to make it look and feel as intuitive as possible. Functionality was also key and that is why I went for a modern minimalistic look. The key features that this User Interface boasts are the simple button transitions of each individual list item as well as the aqua-blue based color scheme of the entire app. 

![Screenshot](https://github.com/Quasay/budget.ly/blob/master/Budget.ly.PNG?raw=true)


## System Architecture 

The system architecture of my application emulates a bare-bone version of a MVC framework with there being only 3 controller structures in the entire project itself. 

The Budget Controller handles all the data structures behind the scenes by continuously updating the data object itself along with calculating the percentages of each Expense/Income object that is added. I designed The Budget Controller to deal with common errors that my app may face such as dividing by 0 and also recalculating all of the percentages when new list items are added. 

The UI Controller is where most of the DOM manipulation happens in my application. It injects new HTML into the app directly whenever new items are added along with deleting them when the user wants to remove them.   

The 'controller' variable itself is the controller that handles the UI and Budget controller.  All the event listeners of my application are set up here and this is the first controller to be initialized when my web application is started.  


![Screenshot](https://github.com/Quasay/budget.ly/blob/master/System%20Architecture.PNG?raw=true)

