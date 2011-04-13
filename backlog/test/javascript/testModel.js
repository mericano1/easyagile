module('model classes');

test('structure', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});
	parent = $("<div>").append(story.block);
	equals($(".ui-widget", parent).length, 1, 'cannot find the top widget' + parent.html());
	
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

	equals($(".assignee", task.block).text(), "Not Assigned", 'text incorrect ' + task.block.html());
	equals($(".storyOrTask-description", task.block).text(), "test task desc", 'text incorrect' + task.block.html());
	equals($(".storyOrTask-name", task.block).text(), "task1", 'text incorrect' + task.block.html());
	equals($(".priority", task.block).text(), "2", 'text incorrect' + task.block.html());
	equals($(".points", task.block).text(), "", 'text incorrect' + task.block.html());
	
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
	equals($(".taskSummary", taskUndefined.block).length, 0, 'taskUndefined class ' + taskUndefined.block.html());
	
	equals($(".testCssClass", taskCustom.block).length, 1, 'taskCustom class ' + taskCustom.block.html());
	equals($(".taskSummary", taskCustom.block).length, 0, 'taskCustom class ' + taskCustom.block.html());
	equals($(".taskSummary-completed", taskCustom.block).length, 0, 'taskCustom class ' + taskCustom.block.html());
	
});

test('story custom css', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0}, null, {css:{summary:"testCssClass"}});
	
	equals($(".testCssClass", story.block).length, 1, 'story Custom class ' + story.block.html());
	equals($(".taskSummary", story.block).length, 0, 'story Custom class ' + story.block.html());
	equals($(".taskSummary-completed", story.block).length, 0, 'story Custom class ' + story.block.html());
	
	
	
	
});

test('Story text', function(){
	var story = new Story({"id":189,"name":"test story 2","description":"test story2 desc","index":0});

	equals($(".assignee", story.block).length, 0, 'story has not assignee ' + story.block.html());
	equals($(".storyOrTask-description", story.block).text(), "test story2 desc", 'text incorrect' + story.block.html());
	equals($(".storyOrTask-name", story.block).text(), "test story 2", 'text incorrect' + story.block.html());
	equals($(".priority", story.block).text(), "1", 'text incorrect' + story.block.html());
	equals($(".points", story.block).text(), "", 'text incorrect' + story.block.html());
	
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