module('model classes');

test('structure', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	parent = $("<div>").append(story.block);
	ok($(".ui-widget", parent).length >= 1, 'cannot find any widget' + parent.html());
	
});

test('Story/Task block icons', function() {
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	
	equals($(".ui-icon-plusthick", story.block).length, 1, 'cannot find the icon plus ' + story.block.html());
	equals($(".ui-icon-triangle-1-e", story.block).length, 1, 'cannot find the icon triangle ' + story.block.html());
	equals($(".ui-icon-user", story.block).length, 0, 'user icon should not be in the story block ' + story.block.html());
	equals($(".ui-icon-check", story.block).length, 0, 'check icon should not be in the story block ' + story.block.html());
	
	equals($(".ui-icon-plusthick", task.block).length, 0, 'icon plus should not be in task block' + task.block.html());
	equals($(".ui-icon-triangle-1-e", task.block).length, 0, 'icon triangle should not be in task block' + task.block.html());
	equals($(".ui-icon-user", task.block).length, 1, 'user icon should not be in the task block ' + task.block.html());
	equals($(".ui-icon-check", task.block).length, 1, 'check icon should not be in the task block ' + task.block.html());
	
});


test('task text', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});

	equals(task.getDisplayAssignee(), "Not Assigned", 'text incorrect ' + task.block.html());
	equals(task.getDisplayDescription(), "test task desc", 'text incorrect' + task.block.html());
	equals(task.getDisplayName(), "task1", 'text incorrect' + task.block.html());
	equals(task.getDisplayIndex(), "2", 'text incorrect' + task.block.html());
	equals(task.getDisplayPoints(), "", 'text incorrect' + task.block.html());
	
});

test('task completed', function(){
	var taskCompleted = new Task({"id":12,"name":"task1","description":"test task desc","index":1, "completed":true});
	var taskIncompleted = new Task({"id":12,"name":"task1","description":"test task desc","index":1, "completed":false});
	var taskUndefined = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	var taskCustom = new Task({"id":12,"name":"task1","description":"test task desc","index":1}, null, {css:{summary:"testCssClass"}});
	
	equals($(".taskSummary-completed", taskCompleted.block).length, 1, 'task completed class ' + taskCompleted.block.html());
	equals($(".taskSummary", taskCompleted.block).length, 0, 'task completed class ' + taskCompleted.block.html());
	
	equals($(".taskSummary-completed", taskIncompleted.block).length, 0, 'taskIncompleted class ' + taskIncompleted.block.html());
	equals($(".taskSummary", taskIncompleted.block).length, 1, 'taskIncompleted class ' + taskIncompleted.block.html());
	
	equals($(".taskSummary-completed", taskUndefined.block).length, 0, 'taskUndefined class ' + taskUndefined.block.html());
	equals($(".taskSummary", taskUndefined.block).length, 1, 'taskUndefined class ' + taskUndefined.block.html());
	
	equals($(".testCssClass", taskCustom.block).length, 1, 'taskCustom class ' + taskCustom.block.html());
	equals($(".taskSummary", taskCustom.block).length, 0, 'taskCustom class ' + taskCustom.block.html());
	equals($(".taskSummary-completed", taskCustom.block).length, 0, 'taskCustom class ' + taskCustom.block.html());
	
});

test('story custom css', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0}, null, {css:{summary:"testCssClass"}});
	
	equals($(".testCssClass", story.block).length, 1, 'story Custom class ' + story.block.html());
	equals($(".storySummary", story.block).length, 0, 'story Custom class ' + story.block.html());
	equals($(".taskSummary-completed", story.block).length, 0, 'story Custom class ' + story.block.html());
	
	
	
	
});

test('Story text', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});

	equals($(".assignee", story.block).length, 0, 'story has not assignee ' + story.block.html());
	equals(story.getDisplayDescription(), "test story2 desc", 'text incorrect' + story.block.html());
	equals(story.getDisplayName(), "test story 2", 'text incorrect' + story.block.html());
	equals(story.getDisplayIndex(), "1", 'text incorrect' + story.block.html());
	equals(story.getDisplayPoints(), "", 'text incorrect' + story.block.html());
	
});

test('Story form - getBlankFormBlock', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});

	form = story.getBlankFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-story", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Story details", 'title incorrect' + form.html());
	
});

test('Task form - getBlankFormHtmlBlock', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});

	form = task.getBlankFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-task", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Task details", 'title incorrect' + form.html());
});


test('Task form - getValuedFormBlock', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});

	form = story.getValuedFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-story", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Story details", 'title incorrect' + form.html());
	equals($("#name", form).val(), "test story 2", 'name is incorrect' + form.html());
	equals($("#description", form).val(), "test story2 desc", 'desc is incorrect' + form.html());
	equals($("#points", form).val(), "", 'points is incorrect' + form.html());
	
	
});

test('Task form - getValuedFormBlock', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});

	form = task.getValuedFormBlock();
	parent = $("<div>").append(form);
	
	equals($("#dialog-form-task", parent).length, 1, 'form has wrong id' + parent.html());
	equals(form.attr("title"), "Task details", 'title incorrect' + form.html());
	equals($("#name", form).val(), "task1", 'name is incorrect' + form.html());
	equals($("#description", form).val(), "test task desc", 'desc is incorrect' + form.html());
	equals($("#points", form).val(), "", 'points is incorrect' + form.html());
});

test('Task form - getNoTasksBlock', function(){
	var noTasks = Task.getNoTaskAvailableBlock();
	
	// .points, .priority, .ui-icon-custom
	equals($(".ui-icon", noTasks).length, 0, 'block has wrong element' + noTasks.block.html());
	equals($(".points", noTasks).length, 0, 'block has wrong element' + noTasks.block.html());
	equals($(".priority", noTasks).length, 0, 'block has wrong element' + noTasks.block.html());
	equals($(".ui-icon-custom", noTasks).length, 0, 'block has wrong element' + noTasks.block.html());
	
	equals(noTasks.getDisplayDescription(), "Click on 'Add Task' to add one", 'text incorrect' + noTasks.block.html());
	equals(noTasks.getDisplayName(), "No Tasks are available", 'text incorrect' + noTasks.block.html());
	
});

test('story markChanged - getter/setter', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	
	equals(story.isChanged(), false, 'changed not set');
	story.markChanged();
	equals($(".changed", story.block).length, 1, 'task changed class' + story.block.html());
	equals(story.isChanged(), true, 'changed set');
	story.unmarkChanged();
	equals(story.isChanged(), false, 'changed reset');
	equals($(".changed", story.block).length, 0, 'task changed class' + story.block.html());
	
});

test('task markChanged - getter/setter', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	
	equals(task.isChanged(), false, 'changed not set');
	task.markChanged();
	equals(task.isChanged(), true, 'changed set');
	equals($(".changed", task.block).length, 1, 'task changed class' + task.block.html());
	task.unmarkChanged();
	equals(task.isChanged(), false, 'changed reset');
	equals($(".changed", task.block).length, 0, 'task changed class' + task.block.html());
	
	
});


test('story complete - getter/setter', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	
	equals(story.isComplete(), undefined, 'changed not set');
	equals($(".storySummary", story.block).length, 1, 'task completed class ' + story.block.html());
	equals($(".storySummary-completed", story.block).length, 0, 'task completed class ' + story.block.html());
	story.markComplete();
	equals(story.isComplete(), true, 'changed set');
	equals($(".storySummary-completed", story.block).length, 1, 'task completed class ' + story.block.html());
	equals($(".storySummary", story.block).length, 0, 'task completed class ' + story.block.html());
	story.unmarkComplete();
	equals(story.isComplete(), false, 'changed reset');
	equals($(".storySummary-completed", story.block).length, 0, 'task completed class ' + story.block.html());
	equals($(".storySummary", story.block).length, 1, 'task completed class ' + story.block.html());
	
});

test('task complete - getter/setter', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	
	equals(task.isComplete(), undefined, 'changed not set');
	equals($(".taskSummary", task.block).length, 1, 'task completed class ' + task.block.html());
	equals($(".taskSummary-completed", task.block).length, 0, 'task completed class ' + task.block.html());
	
	task.markComplete();
	equals(task.isComplete(), true, 'changed set');
	equals($(".taskSummary-completed", task.block).length, 1, 'task completed class ' + task.block.html());
	equals($(".taskSummary", task.block).length, 0, 'task completed class ' + task.block.html());
	
	task.unmarkComplete();
	equals(task.isComplete(), false, 'changed reset');
	equals($(".taskSummary-completed", task.block).length, 0, 'task completed class ' + task.block.html());
	equals($(".taskSummary", task.block).length, 1, 'task completed class ' + task.block.html());
});

test('story visible', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	
	$("body").append(story.block);
	equals(story.isVisible(), true, 'visible');
	equals($(story.block).is(":visible"), true, 'visible' + story.block.html());
	story.setInvisible();
	equals(story.isVisible(), false, 'visible');
	equals($(story.block).is(":visible"), false, 'visible' + story.block.html());
	story.setVisible();
	equals(story.isVisible(), true, 'visible');
	equals($(story.block).is(":visible"), true, 'visible' + story.block.html());
	story.block.remove();
});

test('task visible', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	
	$("body").append(task.block);
	equals(task.isVisible(), true, 'visible');
	equals($(task.block).is(":visible"), true, 'visible' + task.block.html());
	task.setInvisible();
	equals(task.isVisible(), false, 'visible');
	equals($(task.block).is(":visible"), false, 'visible' + task.block.html());
	task.setVisible();
	equals(task.isVisible(), true, 'visible');
	equals($(task.block).is(":visible"), true, 'visible' + task.block.html());
	task.block.remove();
});

test('Story show addNewForm', function(){
	dialog = Story.showAddNewForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	dialog.dialog("close");
	
});

test('task show addNewForm', function(){
	dialog = Task.showAddNewForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	dialog.dialog("close");
	
});


test('Story show editForm', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	dialog = story.showEditForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	equals($("#name", dialog).val(), "test story 2", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test story2 desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "", 'points missing' + dialog.html());
	dialog.dialog("close");
	
	var story2 = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0, "points":5});
	
	dialog = story2.showEditForm();
	equals($("#name", dialog).val(), "test story 2", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test story2 desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "5", 'points missing' + dialog.html());
	dialog.dialog("close");
});


test('task show editForm', function(){
	var task = new Task({"id":12,"name":"task1","description":"test task desc","index":1});
	
	dialog = task.showEditForm();
	equals($("#name", dialog).length, 1, 'name missing ' + dialog.html());
	equals($("#description", dialog).length, 1, 'desc missing' + dialog.html());
	equals($("#points", dialog).length, 1, 'points missing' + dialog.html());
	equals($("#name", dialog).val(), "task1", 'name missing ' + dialog.html());
	equals($("#description", dialog).val(), "test task desc", 'desc missing' + dialog.html());
	equals($("#points", dialog).val(), "", 'points missing' + dialog.html());
	dialog.dialog("close");
	
	var task2 = new Task({"id":12,"name":"task1","description":"test task desc","index":1, "points":555});
	
	dialog = task2.showEditForm();
	equals($("#points", dialog).val(), "555", 'points missing' + dialog.html());
	dialog.dialog("close");
});


test('test create story array', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},{"id":2002,"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	
	var storyObjs = Story.factory(stories);
	equals(storyObjs.length, 25, 'wrong size');
	$(storyObjs).each(function(index, value){
		equals(value.getId(), stories[index]["id"], 'wrong id');
		equals(value.getName(), stories[index]["name"], 'wrong name');
		equals(value.getPoints(), stories[index]["points"], 'wrong points');
		equals(value.getDescription(), stories[index]["description"], 'wrong description');
		
	});
});



test('test create task array', function(){
	var tasks = [{"id":1,"name":"layout","description":"","index":0,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":3002,"name":"Bug - player edit","description":"To recreate: register new user. Click edit player info.","index":1,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":1001,"name":"Front page image (600p x 400p)","description":"","index":2,"points":3,"story":{"kindClassName":"models.Story","id":7001}},{"id":5001,"name":"Bug","description":"edit match- invisible email\u0027s guideline still visible","index":3,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":3001,"name":"Bug","description":"When user is logged in and a match is created it goes to match page and not MatchPlayerHome","index":4,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":2001,"name":"Front page text","description":"","index":5,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":4001,"name":"Bug","description":"Bug: edit match- don\u0027t show creator in list of participants","index":6,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":2002,"name":"Bug","description":"after register in authentication page, too many flash msgs\n\u003cbr/\u003e\n\u003cbr/\u003e\n\u003cb\u003eNote\u003c/b\u003e\u003cbr/\u003e\nThis was not a real bug. We saw duplicated messages because of the duplicated matches created","index":7,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":6001,"name":"Bug","description":"How to recreate:\n\u003col\u003e\n\u003cli\u003eCreate a match not as anonymous\u003c/li\u003e\n\u003cli\u003eSkip login after create match.\u003c/li\u003e\n\u003cli\u003eClick on the confirmation link sent thru email\u003c/li\u003e\n\u003c/ol\u003e\n\u003cp\u003eResult: Logged in user is messed up\u003c/p\u003e\n\u003cp\u003eExpected : User that created the match is logged in\u003c/p\u003e","index":8,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"ftrilnik@gmail.com"}];
	
	var taskObjs = Task.factory(tasks);
	equals(taskObjs.length, 9, 'wrong size');
	$(taskObjs).each(function(index, value){
		equals(value.getId(), tasks[index]["id"], 'wrong id');
		equals(value.getName(), tasks[index]["name"], 'wrong name');
		equals(value.getPoints(), tasks[index]["points"], 'wrong points');
		equals(value.getDescription(), tasks[index]["description"], 'wrong description');
		equals(value.getAssignee(), tasks[index]["assignee"], 'wrong assignee');
	});
});


test('test task bind events', function(){
	var tasks = [{"id":1,"name":"layout","description":"","index":0,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":3002,"name":"Bug - player edit","description":"To recreate: register new user. Click edit player info.","index":1,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":1001,"name":"Front page image (600p x 400p)","description":"","index":2,"points":3,"story":{"kindClassName":"models.Story","id":7001}},{"id":5001,"name":"Bug","description":"edit match- invisible email\u0027s guideline still visible","index":3,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":3001,"name":"Bug","description":"When user is logged in and a match is created it goes to match page and not MatchPlayerHome","index":4,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"andrea.salvadore@gmail.com"},{"id":2001,"name":"Front page text","description":"","index":5,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":4001,"name":"Bug","description":"Bug: edit match- don\u0027t show creator in list of participants","index":6,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"michael.k.baxter@gmail.com"},{"id":2002,"name":"Bug","description":"after register in authentication page, too many flash msgs\n\u003cbr/\u003e\n\u003cbr/\u003e\n\u003cb\u003eNote\u003c/b\u003e\u003cbr/\u003e\nThis was not a real bug. We saw duplicated messages because of the duplicated matches created","index":7,"points":1,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"mdenieffe@gmail.com"},{"id":6001,"name":"Bug","description":"How to recreate:\n\u003col\u003e\n\u003cli\u003eCreate a match not as anonymous\u003c/li\u003e\n\u003cli\u003eSkip login after create match.\u003c/li\u003e\n\u003cli\u003eClick on the confirmation link sent thru email\u003c/li\u003e\n\u003c/ol\u003e\n\u003cp\u003eResult: Logged in user is messed up\u003c/p\u003e\n\u003cp\u003eExpected : User that created the match is logged in\u003c/p\u003e","index":8,"points":2,"completed":true,"story":{"kindClassName":"models.Story","id":7001},"assignee":"ftrilnik@gmail.com"}];
	var taskObjs = Task.factory(tasks);
	
});


test('test story bind events', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},
	               {"id":2002,"name":"Int tests for features","description":"","points":5,"index":1}];
	var storyObjs = Story.factory(stories);
	storyObjs[0].block.trigger("addTask");
});




