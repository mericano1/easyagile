//-----------------------------------------------------------------------
// Templates
//-----------------------------------------------------------------------
var sprintTemplate =     
		"<% if (sprint && sprint.get('id')!=0){%>" +
			"<p>" +
			"<span class='label'>Id:</span><span class='sprint-id value'><%=sprint.display('id')%></span>" +
			"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
			"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;'></span>" + 
			"</p>" +
			"<p><span class='label'>Name:</span><span class='sprint-name value'><%=sprint.display('name')%></span></p>" +
			"<p><span class='label'>From:</span><span class='sprint-from value'><%=sprint.display('startDate')%></span></p>" +
			"<p><span class='label'>To:</span><span class='sprint-to value'><%=sprint.display('endDate')%></span></p>" +
		"<%}else{%>" +
		"<h2>Unassigned</h2>" +
		"<%}%>";
var sprintFormTemplate = 
	"<div id='dialog-form-sprint' title='<%=sprint?'Edit sprint' + sprint.display('name'):'Create new sprint'%>'> " +
		"<p class='validateTips'>Name is required.</p>" + 
		"<form>" + 
		"<fieldset>" + 
			"<label for='name'>Name</label>" + 
			"<input type='text' name='name' id='name' class='text ui-widget-content ui-corner-all' value='<%=sprint?sprint.display('name'):''%>'></input>" + 
			"<label for='startDate'>Start Date</label>" + 
			"<input type='text' name='startDate' id='startDate' class='text ui-widget-content ui-corner-all' value='<%=sprint?sprint.display('startDate'):''%>' >" + 
			"<label for='endDate'>End Date</label>" + 
			"<input type='text' name='endDate' id='endDate' class='text ui-widget-content ui-corner-all' value='<%=sprint?sprint.display('endDate'):''%>' >" + 
		"</fieldset>" + 
		"</form>" + 
	"</div>";

var confirmDeleteDialogTemplate =
	"<div id='dialog-confirm' title='Do you want to delete ?'>" +
	"<p>" +
		"<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>" +
		"The item <%=object.display('name')%> will be permanently deleted and cannot be recovered. Are you sure?" +
	"</p>" +
	"</div>";
	
var confirmMoveTaskToAnotherStoryTemplate =
	"<div id='dialog-confirm' title='Do you want move this task ?'>" +
	"<p>" +
		"<span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>" +
		"The task <%=task.display('name')%> will be move to the story <%=story.display('name')%>. Are you sure?" +
	"</p>" +
	"</div>";

var storyTemplate =
		"<%if (_(css).isUndefined()){css = Statics.settings.css;}" +
			"summaryClass = css.summary;" +
		"if (!_.isUndefined(object.get('completed'))){" +
			"summaryClass = object.get('completed') ? css.completed : css.incompleted;" +
		"}%>" +
		"<div class='<%=css.wrapper%> storyCard'>" +
			"<div class='<%=summaryClass%> ui-corner-all' style='padding: 0 .7em; '>" + 
					"<p>" +
						"<span class='ui-icon ui-icon-circle-triangle-e' title='Click to expand' style='float: left; margin-right: .3em;'></span>" +
						"<span class='ui-icon ui-icon-triangle-1-e' title='Show tasks'style='float: right; margin-left: .3em;'></span>" +
						"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
						"<span class='ui-icon ui-icon-pencil' title='edit' style='float: right; margin-left: .3em;'></span>" +
						"<span class='ui-icon ui-icon-plusthick' title='Add task'style='float: right; margin-left: .3em;'></span>" +
						"<strong class='name' style='display:block'><%=object.display('name')%></strong>" +
						"<div class='description' style='display:none;'><%=Wiky.toHtml(object.display('description'))%></div>" +
					"</p>" +
					"<div class='card-info'>" +
						"<span class='priority'><%=(object.display('index')+ 1)%></span>" +
						"<span class='points'><%=object.display('points')%></span>" + 
							"<div style='clear:both;'/>" + 
							"</div>" +
					"</div>" +
			"</div>" +
		"</div>";
var bugTemplate =
	"<%if (_(css).isUndefined()){css = Statics.settings.css;}" +
		"summaryClass = css.summary;" +
	"if (!_.isUndefined(object.get('completed'))){" +
		"summaryClass = object.get('completed') ? css.completed : css.incompleted;" +
	"}%>" +
	"<div class='<%=css.wrapper%> storyCard'>" +
		"<div class='<%=summaryClass%> ui-corner-all' style='padding: 0 .7em; '>" + 
				"<p>" +
					"<span class='ui-icon ui-icon-circle-triangle-e' title='Click to expand' style='float: left; margin-right: .3em;'></span>" +
					"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
					"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;'></span>" +
					"<span class='ui-icon-custom ui-icon-user' title='Assign Task' style='float: right; margin-left: .3em;'></span>" +
					"<span class='ui-icon ui-icon-check ' title='Mark Fixed' style='float: right; margin-left: .3em;'></span>"+
					"<strong class='name' style='display:block'><%=object.display('name')%></strong>" +
					"<div class='description' style='display:none;'><%=Wiky.toHtml(object.display('description'))%></div>" +
				"</p>" +
				"<div class='card-info'>" +
					"<span class='priority'><%=(object.display('index')+ 1)%></span>" +
					"<span class='assignee'><%=((object.get('assignee')) ? object.display('assignee') : 'Not Assigned')%></span>" +
					"<span class='doneBy'><%=object.display('doneBy')%></span>" +
					"<span class='points'><%=object.display('points')%></span>" + 
						"<div style='clear:both;'/>" + 
						"</div>" +
				"</div>" +
		"</div>" +
	"</div>";
var taskTemplate = 
	"<%if (_(css).isUndefined()){css = Statics.settings.css;}" +
	"summaryClass = css.summary;" +
	"if (!_.isUndefined(object.get('completed'))){" +
		"summaryClass = object.get('completed') ? css.completed : css.incompleted;" +
	"}%>" +
	"<div class='<%=summaryClass%> ui-corner-all' style='padding: 0 .7em;'>" + 
		"<p>" +
			"<span class='ui-icon ui-icon-info' style='float: left; margin-right: .3em;'></span>" +
			"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
			"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;'></span>" +
			"<span class='ui-icon-custom ui-icon-user' title='Assign Task'style='float: right; margin-left: .3em;'></span>" +
			"<span class='ui-icon ui-icon-check ' title='Mark Completed'style='float: right; margin-left: .3em;'></span>"+
			"<strong class='name' style='display:block'><%=object.display('name')%></strong>" +
			"<div class='description'><%=Wiky.toHtml(object.display('description'))%></div>" +
		"</p>" +
		"<div class='card-info'>" +
			"<span class='priority'><%=(object.display('index')+ 1)%></span>" +
			"<span class='assignee'><%=((object.get('assignee')) ? object.display('assignee') : 'Not Assigned')%></span>" +
			"<span class='doneBy'><%=object.display('doneBy')%></span>" +
			"<span class='points'><%=object.display('points')%></span>" + 
				"<div style='clear:both;'/>" + 
				"</div>" +
		"</div>" +
	"</div>";
var storiesHeaderTemplate = 
		"<div class='headerButtons'>" +
			"<button id='addStory'>Add Story</button>" +
			"<button id='addBug'>Add Bug</button>" +
			"<input type='checkbox' id='hideCompleted' <%=settings.hideCompleted?'checked=checked':''%>>Hide Completed</input>" +
			"<p id='userMessages' style='display:inline; margin-left:20px;'>" +
		"</div>" + 
		"<div class='stories'></div>" ;
var sprintsHeaderTemplate = 
		"<span>Sprints</span> <button id='addSprint'>Add Sprint</button>" +
		"<div class='sprintWrapper'>" +
		"</div>" ;
var storyTaskFormTemplate = 
		"<div> " +
			"<p class='validateTips'>All form fields are required.</p>" + 
			"<form>" + 
			"<fieldset>" + 
				"<label for='name'>Name</label>" + 
				"<input type='text' name='name' id='name' class='text ui-widget-content ui-corner-all' ></input>" + 
				"<label for='description'>Description</label>" + 
				"<textarea name='description' id='description' value='' class='text ui-widget-content ui-corner-all' rows='10' ></textarea>" + 
				"<label for='points'>Points</label>" + 
				"<input type='points' name='points' id='points' value='' class='text ui-widget-content ui-corner-all' ></input>" + 
			"</fieldset>" + 
			"</form>" + 
		"</div>";
var assignUserDialogTemplate = 
	"<div>" + 
	"<form>" + 
		"<select class='userSelect'>" +
			"<% _.each(users, function(user) { %> " +
			"<option name=<%=user.get('email')%> value=<%=user.get('email')%>><%=user.get('email')%></option>" +
			"<% }); %>" +
		"</select>" +
		/*"<br/>"+
		"<label for='notify' style='display:inline;margin-top:10px;'>Notify</label>" + 
		"<input type='checkbox' name='notify' id='notify' style='display:inline;'>" +*/
		"<br/>"+
		"<label for='doneBy'style='margin-top:10px;'>Will have it done by</label>" + 
		"<input type='text' name='doneBy' class='doneBy text ui-widget-content ui-corner-all' value='<%=task?task.display('doneBy'):''%>' >" +
	"</form>" + 	
	"</div>";

var confirmAssignStoryToSprintTemplate = 
	"<div id='dialog-confirm' title='Move the story to another sprint?'>" +
	"<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>All the tasks will also be moved. Are you sure?</p>" +
	"</div>";

var storyTasksContainerTemplate = 
	"<div class='story-tasks-arrow-border'></div>" +
	"<div class='story-tasks-arrow'></div>" +
	"<div class='task-list'>" +
	"</div>";
