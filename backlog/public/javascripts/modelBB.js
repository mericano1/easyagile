//-----------------------------------------------------------------------
// Templates
//-----------------------------------------------------------------------
var sprintTemplate =     
		"<% if (sprint && sprint.get('id')!=0){%>" +
			"<p>" +
			"<span class='label'>Id:</span><span class='sprint-id value'><%=sprint.display('id')%></span>" +
			"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;margin-top: -15px;'></span>" + 
			"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;margin-top: -15px;'></span>" + 
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

var storyTemplate = "";
var taskTemplate = "";
var storiesHeaderTemplate = 
		"<div class='headerButtons'>" +
			"<button id='addStory'>Add Story</button>" +
			"<input type='checkbox' id='hideCompleted'>Hide Completed</input>" +
			"<p id='userMessages' style='display:inline; margin-left:20px;'>" +
		"</div>" + 
		"<div class='left-panel'></div>" +
		"<div class='right-panel'></div>" ;

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
	"<select>" +
		"<% _.each(users, function(user) { %> " +
		"<option name=<%=user.get('email')%> value=<%=user.get('email')%>><%=user.get('email')%></option>" +
		"<% }); %>" +
	"</select>" +
	"" +
	"</div>";

var confirmAssignStoryToSprintTemplate = 
	"<div id='dialog-confirm' title='Move the story to another sprint?'>" +
	"<p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>All the tasks will also be moved. Are you sure?</p>" +
	"</div>";

//-----------------------------------------------------------------------
// Statics
//-----------------------------------------------------------------------
Statics = new Object();
Statics.settings = {
	convertJsonFields : ["id", "name", "description", "points", "index", "tasks", "deleted", "completed","assignee"],
	css:{
		completed:"taskSummary-completed",
		incompleted:"taskSummary",
		wrapper:"ui-widget",
		summary: "ui-state-highlight",
		selected: "selected"
	},
	dialog : {
		autoOpen: false,
		height: 480,
		width: 380,
		modal: true,
		resizable: true
	}
};
Statics.errorAlert = function(){
	alert("Ups, something went wrong. Please report the issue and try again later.");
}
//sort function based on element index
Statics.sortFunction = function (a,b) {
	return  (a.info.index < b.info.index) ? -1 : (a.info.index > b.info.index) ? 1 : 0;
};

//gets the html of the block itself
Statics.getHtmlBlock= function (object, css){
	if (_(css).isUndefined()){css = Statics.settings.css;}
	summaryClass = css.summary;
	if (!_.isUndefined(object.get('completed'))){
		summaryClass = object.get('completed') ? css.completed : css.incompleted;
	}
	htmlCode = "<div class='" + css.wrapper + "'>" +
					"<div class='" + summaryClass + " ui-corner-all' style='padding: 0 .7em; '>" + 
							"<p>" +
								"<span class='ui-icon ui-icon-info' style='float: left; margin-right: .3em;'></span>" +
								"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
								"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;'></span>" + 
								"<strong class='name' style='display:block'>"+ object.display('name') +"</strong>" +
								"<div class='description'>" + object.display('description') + "</div>" +
							"</p>" +
						"<div class='card-info'>" +
							"<span class='priority'>" + (object.display('index')+ 1) + "</span>" +
							"<span class='points'>" + object.display('points') + "</span>" + 
								"<div style='clear:both;'/>" + 
								"</div>" +
						"</div>" +
					"</div>" +
				"</div>";
	html = $(htmlCode)
	return html;
}

Statics.closeDialog = function(){$( this ).dialog( "close" );}

//reuse the dialog if it exists
Statics.getFormDialog= function(buttons){
	form = $(this.getFormBlockId());
	if (form.length == 0){
		form = this.getBlankFormBlock();
	} else { //clear existing
		$('form', form)[0].reset()
	}
	dialogOptions = Statics.settings.dialog;
	dialogOptions.buttons = buttons;
	$(form).dialog(dialogOptions);
	return $(form);
}

Statics.getFormObject = function(form){
	obj = {
		name:$( "#name", form ).val().trim(),
		description:$( "#description", form  ).val().trim()
	}
	if ($( "#points", form ).val().trim() != ''){
		obj.points = parseInt($( "#points", form ).val().trim());
	}
	return obj;
}

//shows the add new form. It takes 2 functions, onSave and onCancel.
//The onSave will get the form object as json
Statics.showAddNewForm = function(onSave, onCancel){
	var calling = this;
	var buttons = {
		"Save" : function(){
			onSave(Statics.getFormObject($(this)));
			$(this).dialog("close");
		},
		"Cancel": onCancel,
		"Save and Add another": function(){
			onSave(Statics.getFormObject($(this)));
			$(this).dialog("close");
			calling.showAddNewForm(onSave, onCancel);
		}
	};
	form = this.getFormDialog(buttons);
	$(form).dialog('open');
	return $(form);
}


Statics.getFormBlock= function(){
	return $(storyTaskFormTemplate);
}

//-----------------------------------------------------------------------
//Models
//-----------------------------------------------------------------------

//Base class for story and task
var BaseModel = Backbone.Model.extend({
	display:function(name){
		value = this.get(name);
		return (_(value).isUndefined() || _(value).isNaN())? "": value;
	}
}); 
var WorkUnit = BaseModel.extend({
	clear: function() {
	       this.destroy();
	       if (this.view){this.view.remove();}
	},
    increaseIndex : function(num) { this.set({'index' : this.get('index')+ num}); },
	decreaseIndex : function(num) {	this.set({'index' : this.get('index')- num}); },
	validate: function(attrs){
		if (_(attrs.points).isNaN()){ alert("points have to be numeric");}
	}
});
var Story = WorkUnit.extend({});

var Sprint = BaseModel.extend({});
var SprintList = Backbone.Collection.extend({
	model:Sprint
});

var Task = WorkUnit.extend({});

var User = Backbone.Model.extend({});
var UserList = Backbone.Collection.extend({
	model:User,
});

//-----------------------------------------------------------------------
//Views - TeamView
//-----------------------------------------------------------------------
var TeamView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, "display");
		this.users = this.options.users;
		this.template = _.template(assignUserDialogTemplate);
		this.users.fetch();
	},
	display: function(model){
		var select = $(this.template({users:this.users.models}));
		 $("<div/>").append(select).dialog({
             autoOpen: true,
             height: 150,
             width: 250,
             modal: true,
             resizable: false,
             buttons: {
                  Assign: function(){
                	  model.set({assignee: select.val()});
                      $( this ).dialog( "close" );
                  },
                  Cancel: function() {$( this ).dialog( "close" );}
                 }
		 }
     );
		
	}
});


//-----------------------------------------------------------------------
//Sprint form view
//-----------------------------------------------------------------------
var SprintFormView = Backbone.View.extend({
	initialize: function(){
		_.bindAll(this, "display");
		this.template = _.template(sprintFormTemplate);
		this.onSave = this.options.onSave;
	},
	display: function(){
		var self = this;
		var form =  $(this.template({sprint: this.model}));
		validateForm = function(){
			var toReturn = {
				name:$( "#name", form ).val(),
				startDate: $( "#startDate", form  ).val(),
				endDate: $( "#endDate", form ).val()
			};
			if (toReturn.startDate.trim()== ""){delete toReturn['startDate']}
			if (toReturn.endDate.trim()== ""){delete toReturn['endDate']}
			if (toReturn.name.trim() == ""){
				$( "#name", form ).addClass("ui-state-error");
				return false;
			}
			return toReturn;
		}
		
		$(form).dialog({
			autoOpen: true,
			height: 380,
			width: 380,
			modal: true,
			resizable: true,
			open: function(){
				var options = {dateFormat: Statics.settings.dateFormat};
				$( "#startDate", form).datepicker(options);
				$( "#endDate", form).datepicker(options);
			},
			buttons: {
				Save: function() {
					var toSave = validateForm();
					if (!(toSave === false)){
						self.onSave(toSave);
						$( this ).dialog( "close" );
					}
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
				
			}
		});
	}
});



//-----------------------------------------------------------------------
//Sprint view
//-----------------------------------------------------------------------


var SprintView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this, "changeId","changeName","changeStartDate", "changeEndDate");
		this.model.bind('change:id', this.changeId);
		this.model.bind('change:name', this.changeName);
		this.model.bind('change:startDate', this.changeStartDate);
		this.model.bind('change:endDate', this.changeEndDate);
		this.template = _.template(sprintTemplate);
		this.stories =  new StoryList;
		this.stories.url = Statics.settings.storiesBySprintUrl({sprintId:this.model.get('id')});
	},
	css:{
		selected:"sprintSummary-selected"
	},
	className:"sprintSummary roundedBox",
	tagName:"div",
	events:{
		"click" : "loadSprint",
		"click .ui-icon-trash" : "remove",
		"click .ui-icon-pencil" : "edit"
	},
	render: function(){
		var toRender = $(this.template({sprint:this.model}));
		$('.ui-icon-trash, .ui-icon-pencil',toRender).button();
		$(this.el).html(toRender);
		return this;
	},
	changeId: function(model){$('.sprint-id',this.el).text(model.get('id'));},
	changeName: function(model){$('.sprint-name',this.el).text(model.get('name'));},
	changeStartDate:function(model){$('.sprint-from',this.el).text(model.get('startDate'));},
	changeEndDate: function(model){$('.sprint-to',this.el).text(model.get('endDate'));},
	markSelected : function(){ $(this.el).addClass(this.css.selected);	this.selected = true;},
	unmarkSelected : function(){ $(this.el).removeClass(this.css.selected); this.selected = false;},
	loadSprint:function(){
		if (_(this.model.get('id')).isNumber() && (!this.selected)){
			this.storyContainer = new StoryContainerView({
				el: Statics.settings.backlogEl,
				collection : this.stories
			});
			this.stories.fetch();
			this.trigger('selected', this);
		}
	},
	remove: function(){
		var self = this;
		$(_.template(confirmDeleteDialogTemplate, {object:this.model})).dialog({modal: true,
			buttons:{
				Delete: function() {
					var pCollection = self.model.collection;
					self.model.destroy({success:function(model){
						if (pCollection){
							pCollection.remove(model);
						}
					},error:Statics.errorAlert});
					$(this.el).remove();
					$( this ).dialog( "close" );
				},
				Cancel: function() {;$( this ).dialog( "close" );}
			}
		});
	},
	edit: function(){
		var self = this;
		var view = new SprintFormView({model:self.model, onSave: function(toAdd){
			self.model.set(toAdd);
			self.model.save({error:Statics.errorAlert});
		}});
		view.display();
	}
});

//-----------------------------------------------------------------------
//Views - BaseView
//-----------------------------------------------------------------------
var BaseView = Backbone.View.extend({
	initialize: function(args){
		_.bindAll(this, "changeName", "changeDescription", "changeIndex", "changePoints","markChanged", "unmarkChanged", "changeCompleted");
		this.css =_.defaults({}, (this.options?this.options.css:{}), (this.css?this.css:{}), Statics.settings.css);
		//_.extend(this.model, Backbone.Events);
		this.model.bind('change:name', this.changeName);
		this.model.bind('change:description', this.changeDescription);
		this.model.bind('change:index', this.changeIndex);
		this.model.bind('change:points', this.changePoints);
		//this.model.bind('change', this.markChanged);
		this.model.bind('change:completed', this.changeCompleted);
		this.model.view = this;
	},
	visible: true,
	remove : function() {
		var self = this;
		$(_.template(confirmDeleteDialogTemplate, {object:this.model})).dialog({modal: true,
			buttons:{
				Delete: function() {
					var pCollection = self.model.collection;
					self.model.destroy({success:function(model){
						if (pCollection){
							pCollection.remove(model);
						}
					},error:Statics.errorAlert});
					$(this.el).remove();
					$( this ).dialog( "close" );
				},
				Cancel: function() {;$( this ).dialog( "close" );}
			}
		});
	},
	markChanged : function(){
		this.model.set({'changed':true}, {silent:true});
		if (this.$(".changed").length == 0 ){
			$(".name", this.el).append($("<span>",{'class':"changed", 'css':{'display':'inline'}, text:'*'}));
		}
	},
	unmarkChanged : function(){
		this.model.set({'changed':false}, {silent:true});
		$(".changed", this.el).remove();
	},
	changeCompleted : function(){
		if (this.model.get("completed")){
			$("." + this.css.incompleted, this.el)
				.removeClass(this.css.incompleted)
				.addClass(this.css.completed);
		}else {
			$("." + this.css.completed, this.el)
				.removeClass(this.css.completed)
				.addClass(this.css.incompleted);
		}
	},
	markSelected : function(){ $(this.el).children(':first').children(':first').addClass(this.css.selected); this.selected = true;	},
	unmarkSelected : function(){ $(this.el).children(':first').children(':first').removeClass(this.css.selected); this.selected = false;},
	changeName : function(){$(".name", this.el).text(this.model.get('name'));},
	changeDescription : function(){$(".description", this.el).html(this.model.get('description')); alert(this.model.get('description'));},
	changeIndex : function(){$(".priority", this.el).text(this.model.get('index') + 1);},
	changePoints : function(){$(".points", this.el).text(this.model.get('points'));},
	setVisible : function(){this.visible = true; this.trigger('change:visible', this.visible); $(this.el).show();},
	setInvisible : function(){this.visible = false; this.trigger('change:visible', this.visible); $(this.el).hide();},
	isVisible : function(){return this.visible;},
	getChangeForm: function(onSave){
		var buttons = {
				"Save" : function(){ 
					onSave(Statics.getFormObject($(this)));
					$(this).dialog("close");
				},
				"Cancel": Statics.closeDialog
			};
		form = Statics.getFormDialog.call(this, buttons);
		$("#name", form).val(this.model.display('name'));
		$("#description", form).val(this.model.display('description'));
		$("#points", form).val(this.model.display('points'));
		return $(form);
	},
	showChangeForm: function(){
		var saveUpdateFunction = function(objectToChange){
			this.model.set(objectToChange);
			this.model.save();
		};
		saveUpdateFunction = _.bind(saveUpdateFunction, this);
		form = this.getChangeForm(saveUpdateFunction);
		form.dialog('open');
		return form;
	}
});



//-----------------------------------------------------------------------
//Tasks
//-----------------------------------------------------------------------
TaskViewStatics = new Object();
TaskViewStatics.getFormDialog = Statics.getFormDialog;
TaskViewStatics.getFormBlockId = function(){return "dialog-form-task";}
TaskViewStatics.getBlankFormBlock =  function(){
	html = Statics.getFormBlock();
	html.attr("id", TaskViewStatics.getFormBlockId());
	html.attr("title", "Task details");
	return html;
}
TaskViewStatics.showAddNewForm=function(onSave){
	return Statics.showAddNewForm.call(this,
			onSave,
			Statics.closeDialog
		);
}
TaskViewStatics.css = {
		completed:"taskSummary-completed",
		incompleted:"taskSummary",
		wrapper:"ui-widget",
		summary: "taskSummary",
		selected: "taskSummary-selected"
} 
var TaskView = BaseView.extend({
	css: TaskViewStatics.css,
	initialize: function(){
		_.bindAll(this, "changeAssignee");
		if (!(this.model instanceof Task)){this.model = new Task(this.model);}
		BaseView.prototype.initialize.call(this);
		this.model.bind("change:assignee", this.changeAssignee)
	},
	render: function(){
		html = Statics.getHtmlBlock(this.model, this.css);
		$("<span class='ui-icon-custom ui-icon-user' title='Assign Task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil",html));
		$("<span class='ui-icon ui-icon-check ' title='Mark Completed'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-user", html));
		$("<span class='assignee'>" + ((this.model.get('assignee')) ? this.model.get('assignee') : "Not Assigned") + "</span>").insertAfter($(".priority", html));
		$(".ui-icon-check, .ui-icon-user, .ui-icon-trash, .ui-icon-pencil",  html).button();
		//mark changed
		if (this.model.get('changed') == true){
			$(".name", html).append($("<span>",{'class':"changed", 'css':{'display':'inline'}, text:'*'}));		
		}
		$(this.el).html(html);
		$(this.el).data('model', this.model);
		return this;
	},
	events :{
		"click .ui-icon-user": "assignUser",
		"click .ui-icon-check": "toggleCompleted",
		"click .ui-icon-trash": "remove",
		"click .ui-icon-pencil": "showChangeForm",
		"dblclick":"showChangeForm"
	},
	assignUser: function(){
		Statics.team.display(this.model);
	},
	getFormBlockId : TaskViewStatics.getFormBlockId,
	getBlankFormBlock : TaskViewStatics.getBlankFormBlock,
	showAddNewForm : TaskViewStatics.showAddNewForm,
	changeAssignee: function(){ $(".assignee",this.el).text(this.model.get('assignee'));},
	toggleCompleted: function(){this.model.set({completed: !this.model.get('completed')});}
});

TaskViewStatics.getNoTaskAvailableBlock = function(){
	html = Statics.getHtmlBlock(new Task({name:"No Tasks are available", description:"Click on 'Add Task' to add one", points:""}), TaskViewStatics.css);
	$(".ui-icon, .points, .priority, .ui-icon-custom", html).remove();
	return html;
}

//This is used to create task objects
TaskViewStatics.factory = function(elements){
	var tasks = [];
	$(elements).each(function(index, child){
		tasks.push(new TaskView(child));
	});
	return tasks;
}


//-----------------------------------------------------------------------
//Task Collection 
//-----------------------------------------------------------------------

var BaseList = Backbone.Collection.extend({
	initialize: function(){
		_(this).bindAll("updateIndex", "saveIndexes", "containsIndexChange","addChangeIndex");
		this.changedIndexes = [];
		this.bind("remove", this.updateIndex);
		this.bind("change:index",this.addChangeIndex);
	},
	comparator : function(model) {
	  return model.get("index");
	},
	updateIndex: function(model){
		_(this.models).each(function(model, idx){model.set({index: idx})});
	},
	containsIndexChange:function(model){
		return _(this.changedIndexes).contains(model.get('id'))
	},
	addChangeIndex:  function(model){
		if (!this.containsIndexChange(model)){
			this.changedIndexes.push(model.get('id'));
		}
	},
	saveIndexes: function(){
		var self = this;
		var toSave = _(this.models).filter(this.containsIndexChange);
		var idIndexArray = toSave.map(function(model){ return {id:model.get('id'), index:model.get('index')}});
		var params = {
	      url:          this.url,
	      type:         'PUT',
	      contentType:  'application/json',
	      data:         JSON.stringify(idIndexArray),
	      dataType:     'json',
	      processData:  false,
	      success:      function(){self.changedIndexes = [];},
	      error:        Statics.errorAlert
	    };
		$.ajax(params);
	}	
});

var TaskList = BaseList.extend({
	model:Task
});


//-----------------------------------------------------------------------
//Stories
//-----------------------------------------------------------------------
StoryViewStatics = new Object();
StoryViewStatics.getFormDialog = Statics.getFormDialog;
StoryViewStatics.settings = Statics.settings;
StoryViewStatics.getFormBlockId = function(){return "dialog-form-story";}
StoryViewStatics.getBlankFormBlock = function(){
	html = Statics.getFormBlock();
	html.attr('id', StoryViewStatics.getFormBlockId());
	html.attr('title', 'Story details');
	return html;
}
StoryViewStatics.showAddNewForm=function(onSave){
	return Statics.showAddNewForm.call(this,
			onSave, 
			Statics.closeDialog
		);
}
StoryViewStatics.css = {
		completed:"storySummary-completed",
		incompleted:"storySummary",
		wrapper:"ui-widget",
		summary: "storySummary",
		selected: "storySummary-selected"
} 
var StoryView = BaseView.extend({
	css : StoryViewStatics.css,
	tasks_el : $("div").insertAfter(this.el),
	initialize: function(){
		if (!(this.model instanceof Story)){this.model = new Story(this.model);}
		BaseView.prototype.initialize.call(this);
		_.bindAll(this, 'changeTaskCompleted');
		this.tasks = new TaskList();
		this.tasks.url = Statics.settings.tasksUrl?Statics.settings.tasksUrl({storyId:this.model.get('id')}):"/stories/"+this.model.get('id')+"/tasks";
		this.tasks_el = this.options.tasks_el;
		this.tasks.bind('change:completed', this.changeTaskCompleted);
	},
	events : {
		"click .ui-icon-plusthick": "showNewTaskForm",
		"click .ui-icon-triangle-1-e": "showTasks",
		"click .ui-icon-trash": "remove",
		"click .ui-icon-pencil": "showChangeForm",
		"click .ui-icon-pin-w" : "togglePinTasks",
		"dblclick":"showChangeForm"
	},
	render: function(){
		html = Statics.getHtmlBlock(this.model, this.css);
		//Adds story specific icons
		//$("<span id='togglePinTasks' class='ui-icon ui-icon-pin-w' title='Pin this story\'s tasks' style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-info", html));
		$("<span class='ui-icon ui-icon-triangle-1-e' title='Show tasks'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-info",html));
		$("<span class='ui-icon ui-icon-plusthick' title='Add task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil", html));
		$(".ui-icon-plusthick, .ui-icon-triangle-1-e, .ui-icon-trash, .ui-icon-pencil, .ui-icon-pin-w",  html).button();
		//mark changed
		if (this.model.get('changed')){$(".name", this.el).append($("<span>",{'class':"changed", 'css':{'display':'inline'}, text:'*'}));		}
		$(this.el).html(html);
		$(this.el).data('model', this.model);
		return this;
	},
	getFormBlockId : StoryViewStatics.getFormBlockId,
	getBlankFormBlock : StoryViewStatics.getBlankFormBlock,
	showAddNewForm : StoryViewStatics.showAddNewForm,
	addTask : function(task){
		task.index = this.tasks.length;
		var model = this.tasks._add(task);
		model.save({error:Statics.errorAlert});
	},
	togglePinTasks: function(){
		//$("#togglePinTasks",this.el).toggleClass('ui-icon-pin-s').toggleClass('ui-icon-pin-w');
	},
	showTasks : function(){
		if (_.isUndefined(this.taskContainer)){
			this.taskContainer = new TaskListView({
				collection: this.tasks,
				el: this.tasks_el
			});
			//don't try to fetch if its a new model
			if (!this.model.isNew()){
				this.tasks.fetch();
			}else { 
				this.taskContainer.render();
			}
		} else {
			this.taskContainer.render();
		}
		this.trigger('selected', this);
	},
	showNewTaskForm : function(toSave){
		var self = this;
		TaskViewStatics.showAddNewForm(function(toSave){
			self.addTask(toSave);
			$(this).dialog("close");
		});
		this.showTasks();
	},
	changeTaskCompleted: function(){
		for (var i = 0, l = this.tasks.length; i < l; i++) {
			var task = this.tasks.at(i);
			if (_(task.get('completed')).isUndefined() || task.get('completed') == false ){
				this.model.set({'completed':false});
				return;
			}
		}
		this.model.set({'completed':true});
	},
	setInvisible: function(){		
		BaseView.prototype.setInvisible.call(this);
		if (this.selected){
			$(this.options.tasks_el).empty();
		}
	},
	setVisible: function(){
		BaseView.prototype.setVisible.call(this);
		if (this.selected){
			this.showTasks();
		}
	}
	
});

//-----------------------------------------------------------------------
// Story Collection 
//-----------------------------------------------------------------------
var StoryList = BaseList.extend({
	model:Story
});



//-----------------------------------------------------------------------
// Container
// data 		-> Array of elements of type BaseView
// block 		-> The jQuery html element the children will get 
// loadFunction -> Type specific function on how to create elements and load them
//-----------------------------------------------------------------------
var CollectionView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this, 'add', 'remove', 'render', 'addView', 'onSelected');
		this.collection.bind('refresh', this.render);
		this.collection.bind('add', this.add);
		this.collection.bind('remove', this.remove);
	},
	render:function(){
		//loads the views from the collection
		this.loadViews();
		var self = this;
	    // Clear out this element.
	    $(this.el).empty();
	 
	    // Render each sub-view and append it to the parent view's element.
	    _(this._modelViews).each(function(sv) {
	      $(self.el).append(sv.render().el);
	      sv.delegateEvents();
	    });
	    return this;
	},
	add: function(model){
		var view = this.addView(model);
		if (this.collection.length ==1){$(this.el).empty();} // if its first element lets clear the div 
		$(this.el).append(view.render().el);
		view.delegateEvents();
	},
	remove:function(model){
		var self = this;
		var viewToRemove = _(self._modelViews).select(function(cv) { return cv.model === model; })[0];
		self._modelViews = _(self._modelViews).without(viewToRemove);
		$(viewToRemove.el).remove();
	},
	loadViews:function(){
		var self = this;
		this._modelViews = [];
		this.collection.each(this.addView);
	},
	addView : function(model){
		var curView = this.viewFactory(model);
		curView.bind('selected', this.onSelected);
		this._modelViews.push(curView);
		return curView;
	},
	onSelected:function(view){
		view.markSelected();
		deselect = _(this._modelViews).without(view);
		_(deselect).each(function(aView){
			aView.unmarkSelected();
		})
	}
});

var SortableView = CollectionView.extend({
	initialize: function (){
		_.bindAll(this, "listSortable", "onDragStop", "onDragStart");
		CollectionView.prototype.initialize.call(this);
	},
	listSortable : function(){
		$(this.el).sortable({
				stop: this.onDragStop,
				start: this.onDragStart
		});
	},
	render: function(){
		this.listSortable();
		CollectionView.prototype.render.call(this);
	},
	onDragStop:function(event, ui) {
		dataSet = this.collection;
		var item = ui.item;
		var newIndex = $(item).parent().children().index(item);
		var model = item.data("model");
		var prevIndex = model.get('index');
		//update element indexes
		if (prevIndex == newIndex){return;}
		if (prevIndex > newIndex ) { //drag up
			for (i=newIndex; i < prevIndex; i++){
				element = dataSet.at(i);
				element.increaseIndex(1);
			}
		}
		//prevIndex is still the moved object
		if (prevIndex < newIndex ) { //drag down
			for (i= (prevIndex + 1); i <= newIndex; i++){
				element = dataSet.at(i);
				element.decreaseIndex(1);
			}
		}
		model.set({'index': newIndex});
		dataSet.sort();
		this.save = setTimeout(dataSet.saveIndexes, 5000);
	},
	onDragStart : function(event, ui){
		if(this.save){
			clearTimeout(this.save);
		}
	}
	
});

var StoryListView = SortableView.extend({
	viewFactory: function(model){
		return new StoryView({model:model, tasks_el:this.options.tasks_el});
	}
});

var TaskListView = SortableView.extend({
	viewFactory: function(model){
		return new TaskView({model:model});
	},
	render:function(){
		SortableView.prototype.render.call(this);
		if (this.collection == null || this.collection.length == 0){
			$(this.el).empty().append(TaskViewStatics.getNoTaskAvailableBlock());
		}else{
		}
	}
});

var SprintListView = CollectionView.extend({
	viewFactory: function(model){
		return new SprintView({model:model});
	}
});

var StoryContainerView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this, "addStory");
		this.render();
		this.collection = this.options.collection;
		this.storyList = new StoryListView({
			collection: this.collection,
			el: $('.left-panel', this.el),
			tasks_el : $('.right-panel', this.el),
		});
	},
	events:{
		"click #addStory" : "addStory",
		"change #hideCompleted" : "toggleCompleted"
	},
	render: function(){
		html = _.template(storiesHeaderTemplate,{});
		$(this.el).empty().append(html);
		//main header buttons
		$("#addStory ,#saveStories").button();
		return this;
	},
	addStory: function(){
		var self = this;
		StoryViewStatics.showAddNewForm(function(toSave){
			toSave.index = self.collection.length;
			var model = self.collection._add(toSave);
			model.save({error:Statics.errorAlert});
		});
	},
	toggleCompleted: function(){
		var self = this;
		checkbox = $("#hideCompleted", this.el);
		if (checkbox.is(":checked")){
			this.collection.each(function(model, index){
				if (model.get('completed')){
					model.view.setInvisible();
					if (index === self.storyList.selected){
						$('.right-panel', self.el).empty();
					}
				}
			});
		}else{
			this.collection.each(function(model){
				if (model.get('completed')){
					model.view.setVisible();
				}
			});
		}
	} 
});


var SprintsHeaderView = Backbone.View.extend({
	events:{
		"click #addSprint" : "addSprint"
	},
	render: function(){
		var html = _.template(sprintsHeaderTemplate,{});
		$(this.el).append(html);
		return this;
	},
	addSprint: function(){
		alert("not yet implemented");
	},
	saveStories:function(){
		alert("not yet implemented");
	} 
});