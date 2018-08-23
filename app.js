// Budget Controller 
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1

    }


    Expense.prototype.calcPercentage = function(totalIncome){

        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100); 
        }else{
            this.percentage = -1; 
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;  
    }


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            expense: [],
            income: []
        },

        totals: {
            expense: 0,
            income: 0
        },

        budget: 0,
        percentage: -1 
    }

    var calculateTotal = function(type){
        var sum = 0;

        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });

        data.totals[type] = sum; 


    }

    return {
        addItem: function (type, des, val) {
            var newItem;


            // Creates new ID.
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Creates new Item 
            if (type === "expense") {
                newItem = new Expense(ID, des, val);
            } else if (type === "income") {
                newItem = new Income(ID, des, val);
            }

            // Pushes into our data structure
            data.allItems[type].push(newItem);
            return newItem;
        },

        deleteItem: function(type, id){
            var IDarray , index; 

            IDarray = data.allItems[type].map(function(current){
                return current.id; 
            });

            index = IDarray.indexOf(id);
        
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
        },


        calculateBudget: function(){

            // Calculate Total Income and Expenses 

            calculateTotal('income');
            calculateTotal('expense');
            
            // Calculate the budget: income - expenses 

            data.budget = data.totals.income - data.totals.expense; 

            // Calculate the Percentage of Income that we spent 

            if(data.totals.income > 0){
            data.percentage = Math.round((data.totals.expense / data.totals.income) * 100 )
            }else{
                data.percentage = -1;
            }

        },

        calculatePercentages: function(){

            data.allItems.expense.forEach(function(curr){
                curr.calcPercentage(data.totals.income); 
                // console.log(curr.percentage + '%');
            });
        },


        getAllPercentages: function(){

            var allPerc;

            allPerc = data.allItems.expense.map(function(curr){
                return curr.getPercentage(); 
            });

            return allPerc; 
        },

        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.income,
                totalExp: data.totals.expense,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }

    };

})();

// UI Controller 
var UIController = (function () {
    // Some Code 

    var DOMstrings = {

        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputButton: ".add__btn",
        incomeContainer: ".income__list",
        expenseContainer: ".expenses__list", 
        budgetLabel: ".budget__value",
        incomeLabel: ".budget__income--value",
        expenseLabel: ".budget__expenses--value",
        percentageLabel: ".budget__expenses--percentage",
        container: ".container",
        itemPercentagesLabel: ".item__percentage",
        dateLabel: '.budget__title--month'
    }


    var nodeListForEach = function(list, callback){
        for(var i = 0; i < list.length; i++){
            callback(list[i],i); 
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Income or Expense 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            };
        },

        addListItem: function (obj, type) {

            var element, html, newHTML;

            // Create HTML string with placeholder test 

            if (type === 'income'){

                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

            }else if (type === 'expense'){

                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'

            }

            // console.log(element);

            // Replace the placeholder text with actual data

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description); 
            newHTML = newHTML.replace('%value%', this.formatNumber(obj.value,type));

            // Insert the HTML into the DOM 
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);


        },

        deleteListItem: function(selectorID){

            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element); 

        },


        

        clearFields: function(){

            var fields; 
            fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
            
            var fieldsArr = Array.prototype.slice.call(fields);
    
            fieldsArr.forEach(function(current,index, array){
                current.value = ''; 

            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){

            var type;

            if(obj.budget === 0){
                document.querySelector(DOMstrings.budgetLabel).textContent = '0.00' ;
            }else{
                document.querySelector(DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget,type) ;
            }

            document.querySelector(DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc, 'income');
            document.querySelector(DOMstrings.expenseLabel).textContent = this.formatNumber(obj.totalExp,'expense');

            if (obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayMonth: function(){
            var now, year; 

            now = new Date();
            year = now.getFullYear();

            months = ['January', 'February' , 'March', 'April', 'May' , 'June', 'July', 'August', 'September', 'October' , 'November' , 'December'];
            

            month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " "+ year; 
        },


        displayPercentages: function(percentages){
                
            var fields = document.querySelectorAll(DOMstrings.itemPercentagesLabel);
            

            nodeListForEach(fields, function(current, index){

                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%'; 
                }else{
                    current.textContent = '---';

                }
            });

        },

        formatNumber: function(number, type){
            var num, numSplit; 

            num = Math.abs(number); 
            num = num.toFixed(2);

            numSplit = num.split('.')
            int = numSplit[0];
            dec = numSplit[0]; 

            if(int.length > 3){
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length-3,int.length)
            }

            dec = numSplit[1];
            

            return (type === 'expense' ? '-':'+') + ' ' + int + '.' + dec;

        },

        
        changedType: function(){
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue); 

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');


        },


        getDOMstrings: function () {
            return DOMstrings;
        }
    };
})();

// Global App Controller 
var controller = (function (budgetCtrl, UIctrl) {
    var setupEventListeners = function () {

        var DOM = UIctrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UIctrl.changedType);

    };

    var updateBudget = function(){

        // 1. Calculate the budget 
        budgetCtrl.calculateBudget();

        // 2. Return the Budget 
        var budget = budgetCtrl.getBudget();  

        // 3. Display the budget on the UI
        UIctrl.displayBudget(budget);
    };


    var updatePercentages = function() {
        
        budgetCtrl.calculatePercentages();
        var percentages =  budgetCtrl.getAllPercentages(); 

        UIctrl.displayPercentages(percentages);
    };



    var ctrlAddItem = function () {

        var input, newItem;

        // Get the filled input data 
        input = UIctrl.getInput();


        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
            // Add the item to the UI + clear fields 
            UIctrl.addListItem(newItem, input.type); 
            UIctrl.clearFields();   
            
            updateBudget();

            updatePercentages()
        }
    };

    var ctrlDeleteItem = function(){

        var itemID, splitID, type, IDval; 
    
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        

        if(itemID){
            
            splitID =  itemID.split('-');
            type = splitID[0];
            IDval = parseInt(splitID[1]);

             // Deletes Item from Data Structure 
            budgetCtrl.deleteItem(type, IDval); 

            // Deletes Item from UI
            UIctrl.deleteListItem(itemID);

            // Update & Show new budget 
            updateBudget();
        
        }
    };


    return {
        init: function () {
            console.log('Application has started.');
            UIctrl.displayMonth();
            UIctrl.displayBudget({

                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,

            });                
            setupEventListeners();




        }
    };
})(budgetController, UIController);



// Initialization Function
controller.init();