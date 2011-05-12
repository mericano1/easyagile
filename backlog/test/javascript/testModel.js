module('model classes');

test('structure', function(){
	var story = new StoryView({model:{"id":189,"name":"test story 2","description":"test story2 desc","index":0}});
	parent = $("<div>").append(story.render().el);
	ok($(".ui-widget", parent).length >= 1, 'cannot find any widget' + parent.html());
	
});

test('Story/Task block icons', function() {
	var story = new StoryView({model:{"id":189,"name":"test story 2","description":"test story2 desc","index":0}});
	var task = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1}});
	var storyHtml = $(story.render().el);
	var taskHtml = $(task.render().el);
	
	equals($(".ui-icon-plusthick", storyHtml).length, 1, 'cannot find the icon plus ' + storyHtml);
	equals($(".ui-icon-triangle-1-e", storyHtml).length, 1, 'cannot find the icon triangle ' + storyHtml);
	equals($(".ui-icon-user", storyHtml).length, 0, 'user icon should not be in the story block ' + storyHtml);
	equals($(".ui-icon-check", storyHtml).length, 0, 'check icon should not be in the story block ' + storyHtml);
	
	equals($(".ui-icon-plusthick", task.el).length, 0, 'icon plus should not be in task block' + $(task.el).html());
	equals($(".ui-icon-triangle-1-e", task.el).length, 0, 'icon triangle should not be in task block' + $(task.el).html());
	equals($(".ui-icon-user", task.el).length, 1, 'user icon should not be in the task block ' + $(task.el).html());
	equals($(".ui-icon-check", task.el).length, 1, 'check icon should not be in the task block ' + $(task.el).html());
	
});


test('task text', function(){
	var task = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1}});
	var taskHtml = $(task.render().el);
	
	equals(task.$(".assignee").text(), "Not Assigned", 'text incorrect ' + taskHtml);
	equals(task.$(".description").text(), "test task desc", 'text incorrect' + taskHtml);
	equals(task.$(".name").text(), "task1", 'text incorrect' +taskHtml);
	equals(task.$(".priority").text(), "2", 'text incorrect' +taskHtml);
	equals(task.$(".points").text(), "", 'text incorrect' +taskHtml);
	
});

test('task completed', function(){
	var taskCompleted = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1, "completed":true}});
	var taskIncompleted = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1, "completed":false}});
	var taskUndefined = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1}});
	var taskCustom = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1}, css:{summary:"testCssClass"}});
	
	
	var taskCompletedDom = $(taskCompleted.render().el);
	var taskIncompletedDom = $(taskIncompleted.render().el);
	var taskUndefinedDom = $(taskUndefined.render().el);
	var taskCustomDom = $(taskCustom.render().el);
	
	equals($(".taskSummary-completed", taskCompletedDom).length, 1, 'task completed class ' + taskCompletedDom.html());
	equals($(".taskSummary", taskCompletedDom).length, 0, 'task completed class ' + taskCompletedDom.html());
	
	equals($(".taskSummary-completed", taskIncompletedDom).length, 0, 'taskIncompleted class ' + taskIncompletedDom.html());
	equals($(".taskSummary", taskIncompletedDom).length, 1, 'taskIncompleted class ' + taskIncompletedDom.html());
	
	equals($(".taskSummary-completed", taskUndefinedDom).length, 0, 'taskUndefined class ' + taskUndefinedDom.html());
	equals($(".taskSummary", taskUndefinedDom).length, 1, 'taskUndefined class ' + taskUndefinedDom.html());
	
	equals($(".testCssClass", taskCustomDom).length, 1, 'taskCustom class ' + taskCustomDom.html());
	equals($(".taskSummary", taskCustomDom).length, 0, 'taskCustom class ' + taskCustomDom.html());
	equals($(".taskSummary-completed", taskCustomDom).length, 0, 'taskCustom class ' + taskCustomDom.html());
	
});

test('story custom css', function(){
	var story = new StoryView({model:{"id":189,"name":"test story 2","description":"test story2 desc","index":0}, css:{summary:"testCssClass"}});
	
	var storyDom = $(story.render().el);
	equals(story.$(".testCssClass").length, 1, 'story Custom class ' +storyDom.html());
	equals(story.$(".storySummary").length, 0, 'story Custom class ' +storyDom.html());
	equals(story.$(".taskSummary-completed").length, 0, 'story Custom class ' +storyDom.html());
	
});

test('Story text', function(){
	var story = new StoryView({model:{"id":189,"name":"test story 2","description":"test story2 desc","index":0}});
	
	var storyDom = $(story.render().el);
	
	equals(story.$(".assignee").length, 0, 'story has not assignee ' +storyDom.html());
	equals(story.$('.description').text(), "test story2 desc", 'text incorrect' +storyDom.html());
	equals(story.$('.name').text(), "test story 2", 'text incorrect' +storyDom.html());
	equals(story.$('.priority').text(), "1", 'text incorrect' +storyDom.html());
	equals(story.$('.points').text(), "", 'text incorrect' +storyDom.html());
	
});

test('Story form - getBlankFormBlock', function(){
	form = StoryViewStatics.getBlankFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-story", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Story details", 'title incorrect' + form.html());
	
});

test('Task form - getBlankFormHtmlBlock', function(){
	form = TaskViewStatics.getBlankFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-task", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Task details", 'title incorrect' + form.html());
});


test('Task form - getValuedFormBlock', function(){
	var story = new StoryView({model:{"id":189,"name":"test story 2","description":"test story2 desc","index":0}});

	form = story.getChangeForm();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-story", parent).length, 1, 'form has wrong id' + parent.html());
	//equals(form.attr("title"), "Story details", 'title incorrect' + parent.html());
	equals($("#name", form).val(), "test story 2", 'name is incorrect' + form.html());
	equals($("#description", form).val(), "test story2 desc", 'desc is incorrect' + form.html());
	equals($("#points", form).val(), "", 'points is incorrect' + form.html());
	
	
});

test('Task form - getValuedFormBlock', function(){
	var task = new TaskView({model:{"id":12,"name":"task1","description":"test task desc","index":1}});

	form = task.getChangeForm();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-task", parent).length, 1, 'form has wrong id' + parent.html());
	//equals(form.attr("title"), "Task details", 'title incorrect' + form.html());
	equals($("#name", form).val(), "task1", 'name is incorrect' + form.html());
	equals($("#description", form).val(), "test task desc", 'desc is incorrect' + form.html());
	equals($("#points", form).val(), "", 'points is incorrect' + form.html());
});

test('Task form - getNoTasksBlock', function(){
	var noTasks = TaskViewStatics.getNoTaskAvailableBlock();
	
	// .points, .priority, .ui-icon-custom
	equals($(".ui-icon", noTasks).length, 0, 'block has wrong element' + noTasks.html());
	equals($(".points", noTasks).length, 0, 'block has wrong element' + noTasks.html());
	equals($(".priority", noTasks).length, 0, 'block has wrong element' + noTasks.html());
	equals($(".ui-icon-custom", noTasks).length, 0, 'block has wrong element' + noTasks.html());
	
	equals($(".description", noTasks).text(), "Click on 'Add Task' to add one", 'text incorrect' + noTasks.html());
	equals($(".name", noTasks).text(), "No Tasks are available", 'text incorrect' + noTasks.html());
	
});

test('story changed', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	view = new StoryView({model:story});
	var storyDom = $(view.render().el);
	
	story.set({"name": "changed"});
	stop();  
	setTimeout(function (){
		equals(view.$(".name").text(), "changed*", 'story changed display value' + storyDom.html());
		equals(view.$(".changed").length, 1, 'story changed class' + storyDom.html());
		start();  
	}, 200);
	
	
});

test('task changed - getter/setter', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	view = new TaskView({model:task});
	var taskDom = $(view.render().el);
	
	task.set({"name": "changed task"});
	stop();  
	setTimeout(function (){
		equals(view.$(".name").text(), "changed task*", 'task changed display value' + taskDom.html());
		equals(view.$(".changed").length, 1, 'task changed class' + taskDom.html());
		start();  
	}, 200);
	
});


test('story complete - getter/setter', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	view = new StoryView({model:story});
	var storyDom = $(view.render().el);
	
	equals(story.get('completed'), undefined, 'changed not set');
	equals($(".storySummary", storyDom).length, 1, 'story completed undefined ' + storyDom.html());
	equals($(".storySummary-completed", storyDom).length, 0, 'story completed undefined ' + storyDom.html());
	
	story.set({'completed':true});
	equals(story.get('completed'), true, 'changed set');
	equals($(".storySummary-completed", storyDom).length, 1, 'story completed true ' + storyDom.html());
	equals($(".storySummary", storyDom).length, 0, 'story completed true ' + storyDom.html());
	
	story.set({'completed':false});
	equals(story.get('completed'), false, 'changed reset');
	equals($(".storySummary-completed", storyDom).length, 0, 'story completed false ' + storyDom.html());
	equals($(".storySummary", storyDom).length, 1, 'story completed false ' + storyDom.html());
	
});

test('task complete - getter/setter', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	view = new TaskView({model:task});
	var taskDom = $(view.render().el);
	
	equals(task.get('completed'), undefined, 'changed not set');
	equals($(".taskSummary", taskDom).length, 1, 'task completed undefined ' + taskDom.html());
	equals($(".taskSummary-completed", taskDom).length, 0, 'task completed undefined ' + taskDom.html());
	
	task.set({'completed':true});
	equals(task.get('completed'), true, 'changed set');
	equals($(".taskSummary-completed", taskDom).length, 1, 'task completed true ' + taskDom.html());
	equals($(".taskSummary", taskDom).length, 0, 'task completed true ' + taskDom.html());
	
	task.set({'completed':false});
	equals(task.get('completed'), false, 'changed reset');
	equals($(".taskSummary-completed", taskDom).length, 0, 'task completed false ' + taskDom.html());
	equals($(".taskSummary", taskDom).length, 1, 'task completed false ' + taskDom.html());
});

test('story visible', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	view = new StoryView({model:story});
	var storyDom = $(view.render().el);
	
	$("body").append(storyDom);
	equals(view.isVisible(), true, 'visible');
	equals(storyDom.is(":visible"), true, 'visible' + storyDom.html());
	view.setInvisible();
	equals(view.isVisible(), false, 'visible');
	equals(storyDom.is(":visible"), false, 'visible' + storyDom.html());
	view.setVisible();
	equals(view.isVisible(), true, 'visible');
	equals(storyDom.is(":visible"), true, 'visible' + storyDom.html());
	storyDom.remove();
});

test('task visible', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	view = new TaskView({model:task});
	var taskDom = $(view.render().el);
	
	$("body").append(taskDom);
	equals(view.isVisible(), true, 'visible');
	equals(taskDom.is(":visible"), true, 'visible' + taskDom.html());
	view.setInvisible();
	equals(view.isVisible(), false, 'visible');
	equals(taskDom.is(":visible"), false, 'visible' + taskDom.html());
	view.setVisible();
	equals(view.isVisible(), true, 'visible');
	equals(taskDom.is(":visible"), true, 'visible' + taskDom.html());
	taskDom.remove();
});

test('Story show addNewForm', function(){
	dialog = StoryViewStatics.showAddNewForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	dialog.dialog("close");
	
});

test('task show addNewForm', function(){
	dialog = TaskViewStatics.showAddNewForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	dialog.dialog("close");
	
});


test('Story show editForm', function(){
	var story = new Story({"id":19,"name":"test story 2","description":"test story2 desc","index":0});
	view = new StoryView({model:story});
	
	dialog = view.showChangeForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	equals($("#name", dialog).val(), "test story 2", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test story2 desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "", 'points missing' + dialog.html());
	dialog.dialog("close");
	
	var story2 = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0, "points":5});
	view2 = new StoryView({model:story2});
	
	dialog = view2.showChangeForm();
	equals($("#name", dialog).val(), "test story 2", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test story2 desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "5", 'points missing' + dialog.html());
	dialog.dialog("close");
});


test('task show editForm', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	view = new TaskView({model:task});
	
	dialog = view.showChangeForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	equals($("#name", dialog).val(), "task1", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test task desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "", 'points missing' + dialog.html());
	dialog.dialog("close");
	
	var task2 = new Task({"id":12,"name":"task1","description":"test task desc","index":1, "points":555});
	view2 = new TaskView({model:task2});
	
	dialog = view2.showChangeForm();
	equals($("#points", dialog).val(), "555", 'points missing' + dialog.html());
	dialog.dialog("close");
});


test('test create story array', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},{"id":2002,"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	
	var storyObjs = new StoryList(stories);
	equals(storyObjs.length, 25, 'wrong size');
	storyObjs.each(function(value, index){
		equals(value.get('id'), stories[index]["id"], 'wrong id');
		equals(value.get('index'), stories[index]["index"], 'wrong index');
		equals(value.get('name'), stories[index]["name"], 'wrong name');
		equals(value.get('points'), stories[index]["points"], 'wrong points');
		equals(value.get('description'), stories[index]["description"], 'wrong description');
		
	});
});



test('test create task array', function(){
	var tasks = [{"id":1,"name":"layout","description":"","index":0,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":3002,"name":"Bug - player edit","description":"To recreate: register new user. Click edit player info.","index":1,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":1001,"name":"Front page image (600p x 400p)","description":"","index":2,"points":3,"story":{"kindClassName":"models.Story","id":7001}},{"id":5001,"name":"Bug","description":"edit match- invisible email\u0027s guideline still visible","index":3,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":3001,"name":"Bug","description":"When user is logged in and a match is created it goes to match page and not MatchPlayerHome","index":4,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":2001,"name":"Front page text","description":"","index":5,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":4001,"name":"Bug","description":"Bug: edit match- don\u0027t show creator in list of participants","index":6,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":2002,"name":"Bug","description":"after register in authentication page, too many flash msgs\n\u003cbr/\u003e\n\u003cbr/\u003e\n\u003cb\u003eNote\u003c/b\u003e\u003cbr/\u003e\nThis was not a real bug. We saw duplicated messages because of the duplicated matches created","index":7,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":6001,"name":"Bug","description":"How to recreate:\n\u003col\u003e\n\u003cli\u003eCreate a match not as anonymous\u003c/li\u003e\n\u003cli\u003eSkip login after create match.\u003c/li\u003e\n\u003cli\u003eClick on the confirmation link sent thru email\u003c/li\u003e\n\u003c/ol\u003e\n\u003cp\u003eResult: Logged in user is messed up\u003c/p\u003e\n\u003cp\u003eExpected : User that created the match is logged in\u003c/p\u003e","index":8,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"ftrilnik@gmail.com"}];
	
	var taskObjs = new TaskList(tasks);
	equals(taskObjs.length, 9, 'wrong size');
	taskObjs.each(function(value, index){
		equals(value.get('id'), tasks[index]["id"], 'wrong id');
		equals(value.get('index'), tasks[index]["index"], 'wrong index');
		equals(value.get('name'), tasks[index]["name"], 'wrong name');
		equals(value.get('points'), tasks[index]["points"], 'wrong points');
		equals(value.get('description'), tasks[index]["description"], 'wrong description');
		equals(value.get('assignee'), tasks[index]["assignee"], 'wrong assignee');
		equals(value.get('completed'), tasks[index]["completed"], 'wrong assignee');
	});
});


test('test task change index', function(){
	var tasks = [{"id":1,"name":"layout","description":"","index":0,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},
	             {"id":3002,"name":"Bug - player edit","description":"To recreate: register new user. Click edit player info.","index":1,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},
	             {"id":1001,"name":"Front page image (600p x 400p)","description":"","index":2,"points":3,"story":{"kindClassName":"models.Story","id":7001}},
	             {"id":5001,"name":"Bug","description":"edit match- invisible email\u0027s guideline still visible","index":3,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},
	             {"id":3001,"name":"Bug","description":"When user is logged in and a match is created it goes to match page and not MatchPlayerHome","index":4,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},
	             {"id":2001,"name":"Front page text","description":"","index":5,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},
	             {"id":4001,"name":"Bug","description":"Bug: edit match- don\u0027t show creator in list of participants","index":6,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},
	             {"id":2002,"name":"Bug","description":"after register in authentication page, too many flash msgs\n\u003cbr/\u003e\n\u003cbr/\u003e\n\u003cb\u003eNote\u003c/b\u003e\u003cbr/\u003e\nThis was not a real bug. We saw duplicated messages because of the duplicated matches created","index":7,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},
	             {"id":6001,"name":"Bug","description":"How to recreate:\n\u003col\u003e\n\u003cli\u003eCreate a match not as anonymous\u003c/li\u003e\n\u003cli\u003eSkip login after create match.\u003c/li\u003e\n\u003cli\u003eClick on the confirmation link sent thru email\u003c/li\u003e\n\u003c/ol\u003e\n\u003cp\u003eResult: Logged in user is messed up\u003c/p\u003e\n\u003cp\u003eExpected : User that created the match is logged in\u003c/p\u003e","index":8,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"ftrilnik@gmail.com"}];
	
	var taskObjs = new TaskList(tasks);
	equals(taskObjs.length, 9, 'wrong size');
	//swap indexes
	taskObjs.at(0).set({index:1});
	taskObjs.at(1).set({index:0});
	taskObjs.sort();
	//assert the changed indexes are in the array
	equals(taskObjs.changedIndexes.length, 2, 'wrong changed index size');
	var options = null;
    jQuery.ajax = function (param) {
        options = param;
    };
    
    taskObjs.saveIndexes();
    same('[{"id":3002,"index":0},{"id":1,"index":1}]', options.data);
    
    options.success();
    equals(taskObjs.changedIndexes.length, 0, 'changed indexes dont get reset');
    
    //delete second item
    var second = taskObjs.at(1);
    taskObjs.remove(second);
    equals(taskObjs.length, 8, 'wrong size');
    //check indexes
    
    taskObjs.each(function(model,index){
    	same(index, model.get('index'),'index is not right');
    });
    
    equals(taskObjs.changedIndexes.length, taskObjs.length - 1, 'wrong number of indexes for an update' + taskObjs.changedIndexes);
    
	
});


test('test story change index', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},
	               {"id":2002,"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	
	var storyObjs = new StoryList(stories);
	equals(storyObjs.length, 25, 'wrong size');
	storyObjs.each(function(value, index){
		equals(value.get('id'), stories[index]["id"], 'wrong id');
		equals(value.get('index'), stories[index]["index"], 'wrong index');
		equals(value.get('name'), stories[index]["name"], 'wrong name');
		equals(value.get('points'), stories[index]["points"], 'wrong points');
		equals(value.get('description'), stories[index]["description"], 'wrong description');
		
	});
	
	storyObjs.at(0).set({index:1});
	storyObjs.at(1).set({index:0});
	storyObjs.sort();
	//assert the changed indexes are in the array
	equals(storyObjs.changedIndexes.length, 2, 'wrong changed index size');
	
	var options = null;
    jQuery.ajax = function (param) {
        options = param;
    };
    
    storyObjs.saveIndexes();
    same('[{"id":2002,"index":0},{"id":7001,"index":1}]', options.data);
    
    options.success();
    equals(storyObjs.changedIndexes.length, 0, 'changed indexes dont get reset');
    
    //delete second item
    var second = storyObjs.at(1);
    storyObjs.remove(second);
    equals(storyObjs.length, 24, 'wrong size');
    //check indexes
    
    storyObjs.each(function(model,index){
    	same(index, model.get('index'),'index is not right');
    });
    
    equals(storyObjs.changedIndexes.length, storyObjs.length - 1, 'wrong number of indexes for an update' + storyObjs.changedIndexes);
});

test('swap and swap back indexes', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},
	               {"id":2002,"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	
	var storyObjs = new StoryList(stories);
	storyObjs.at(0).set({index:1});
	storyObjs.at(1).set({index:0});
	
	//assert the changed indexes are in the array
	equals(storyObjs.changedIndexes.length, 2, 'wrong changed index size');
	
	//swap back
	storyObjs.at(0).set({index:0});
	storyObjs.at(1).set({index:1});
	
	//assert the changed indexes is still the same
	equals(storyObjs.changedIndexes.length, 2, 'changed index has duplicates');
	
	
});


test('tasks complete = story complete', function(){
	var story = new StoryView({"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0});
	var tasks = [{"id":3002,"name":"Bug - player edit","description":"To recreate: register new user. Click edit player info.","index":1,"points":1,"completed":false,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},
	             {"id":1001,"name":"Front page image (600p x 400p)","description":"","index":2,"points":3,"story":{"kindClassName":"models.Story","id":7001}},
	             {"id":5001,"name":"Bug","description":"edit match- invisible email\u0027s guideline still visible","index":3,"points":1,"completed":false,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"}];

	var storyEl = $(story.render().el);
	story.tasks.add(tasks[0]);
	story.tasks.add(tasks[1]);
	story.tasks.add(tasks[2]);
	
	equals(story.$('.storySummary-completed').length, 0, 'no story complete class' + storyEl.html());
	
	var task1 = story.tasks.at(0);
	var task2 = story.tasks.at(1);
	var task3 = story.tasks.at(2);
	
	task3.set({'completed':true});
	equals(story.$('.storySummary-completed').length, 0, 'no story complete class' + storyEl.html());
	task2.set({'completed':true});
	equals(story.$('.storySummary-completed').length, 0, 'no story complete class' + storyEl.html());
	task1.set({'completed':true});
	equals(story.$('.storySummary-completed').length, 1, 'story is now completed' + storyEl.html());
	

	
});


