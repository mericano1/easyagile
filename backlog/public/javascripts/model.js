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
		if (_(value).isDate()){return value.toString(Statics.settings.dateFormat)}
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
		var form = $(this.template({users:this.users.models, task:model}));
		 $("<div/>").append(form).dialog({
             autoOpen: true,
             height: 180,
             width: 250,
             modal: true,
             resizable: false,
             open: function(){
 				var options = {dateFormat: Statics.settings.dateFormat};
 				$( "#doneBy", form).datepicker(options);
 			},
             buttons: {
                  Assign: function(){
                	  model.set({assignee: $('.userSelect',form).val(), doneBy:$('#doneBy',form).val()});
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
		"click .ui-icon-pencil" : "edit",
		"drop" : "dropStory"
	},
	render: function(){
		var toRender = $(this.template({sprint:this.model}));
		$('.ui-icon-trash, .ui-icon-pencil',toRender).button();
		$(this.el).html(toRender).droppable();
		return this;
	},
	changeId: function(model){
		$('.sprint-id',this.el).text(model.display('id'));
		this.stories.url = Statics.settings.storiesBySprintUrl({sprintId:this.model.get('id')});
	},
	changeName: function(model){$('.sprint-name',this.el).text(model.display('name'));},
	changeStartDate:function(model){$('.sprint-from',this.el).text(model.display('startDate'));},
	changeEndDate: function(model){$('.sprint-to',this.el).text(model.display('endDate'));},
	markSelected : function(){ $(this.el).addClass(this.css.selected);	this.selected = true;},
	unmarkSelected : function(){ $(this.el).removeClass(this.css.selected); this.selected = false;},
	loadSprint:function(){
		if (_(this.model.get('id')).isNumber() && (!this.selected)){
			$(Statics.settings.backlogEl).html($('<img>',{src:'/public/images/loadingTxt.gif',alt:'Loading tasks'}));
			this.storyContainer = new SprintStoriesView({
				el: Statics.settings.backlogEl,
				collection : this.stories,
				sprint: this
			});
			this.stories.fetch();
			this.trigger('selected', this);
		}
	},
	dropStory: function(event, ui){
		var self = this;
		story = $(ui.draggable).data('model');
		if (story instanceof Story && (this.selected !== true)){
			$(_.template(confirmAssignStoryToSprintTemplate,{})).dialog({
        		resizable: false,
    			height:140,
    			modal: true,
    			autoOpen:true,
    			buttons: {
    				"Yes move it": function() {
    					$.ajax({
    						url:Statics.settings.allocateToSprint({sprintId:self.model.get('id')}),
    						type: 'POST',
    						data: JSON.stringify(story), 
    						success: function(){ story.view.removeFromView();},
    						error: Statics.errorAlert
    					});
    					$(this).dialog( "close" );
    				},
    				Cancel: function() {
    					$(this).dialog( "close" );
    				}
    			}

        	});
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
			//self.model.save({error:Statics.errorAlert});
		}});
		view.display();
	}
});

//-----------------------------------------------------------------------
//Views - BaseView
//-----------------------------------------------------------------------
var BaseView = Backbone.View.extend({
	initialize: function(args){
		_.bindAll(this, "changeName", "changeDescription", "changeIndex", "changePoints",/*"markChanged", "unmarkChanged",*/ "changeCompleted");
		this.css =_.defaults({}, (this.options?this.options.css:{}), (this.css?this.css:{}), Statics.settings.css);
		this.model.bind('change:name', this.changeName);
		this.model.bind('change:description', this.changeDescription);
		this.model.bind('change:index', this.changeIndex);
		this.model.bind('change:points', this.changePoints);
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
					$(self.el).remove();
					$( this ).dialog( "close" );
				},
				Cancel: function() {;$( this ).dialog( "close" );}
			}
		});
	},
	removeFromView : function(){
		var pCollection = this.model.collection;
		if (pCollection){
			pCollection.remove(this.model);
		}
		$(this.el).remove();
	},
	changeCompleted : function(){
		if (this.model.get("completed")){
			$("." + this.css.incompleted, this.el).removeClass(this.css.incompleted).addClass(this.css.completed);
		}else {
			$("." + this.css.completed, this.el).removeClass(this.css.completed).addClass(this.css.incompleted);
		}
	},
	markSelected : function(){ $(this.el).children(':first').children(':first').addClass(this.css.selected); this.selected = true;	},
	unmarkSelected : function(){ $(this.el).children(':first').children(':first').removeClass(this.css.selected); this.selected = false;},
	changeName : function(){$(".name", this.el).text(this.model.get('name'));},
	changeDescription : function(){$(".description", this.el).html(this.model.get('description'));},
	changeIndex : function(){$(".priority", this.el).text(this.model.get('index') + 1);},
	changePoints : function(){$(".points", this.el).text(this.model.get('points'));},
	setVisible : function(){this.visible = true; this.trigger('change:visible', this.visible); $(this.el).show();},
	setInvisible : function(){this.visible = false; this.trigger('change:visible', this.visible); $(this.el).hide('slow');},
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
		_.bindAll(this, "changeAssignee", "changeDoneBy");
		if (!(this.model instanceof Task)){this.model = new Task(this.model);}
		BaseView.prototype.initialize.call(this);
		this.model.bind("change:assignee", this.changeAssignee);
		this.model.bind("change:doneBy", this.changeDoneBy);
		this.template = _.template(taskTemplate);
	},
	render: function(){
		html = $(this.template({object:this.model, css:this.css}));
		$(".ui-icon-check, .ui-icon-user, .ui-icon-trash, .ui-icon-pencil",  html).button();
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
	changeDoneBy: function(){ $(".doneBy",this.el).text(this.model.get('doneBy'));},
	toggleCompleted: function(){this.model.set({completed: !this.model.get('completed')});}
});

TaskViewStatics.getNoTaskAvailableBlock = function(){
	myTask = new Task({name:"No Tasks are available", description:"Click on 'Add Task' to add one", points:""});
	html = $(_.template(taskTemplate, {
		object:myTask, 
		css: TaskViewStatics.css
	}));
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
		_(this).bindAll("updateIndexes", "save", "containsChanged", "addChanged", "startTimer");
		this.changed = [];
		this.bind("remove", this.updateIndexes);
		this.bind("change",this.addChanged);
	},
	comparator : function(model) {
	  return model.get("index");
	},
	updateIndexes: function(model){
		_(this.models).each(function(model, idx){model.set({index: idx})});
	},
	containsChanged: function(model){
		return (_(model.get('id')).isUndefined()) || _(this.changed).contains(model.get('id'));
	},
	addChanged: function(model){
		if (!this.containsChanged(model) && (!model.hasChanged('id'))){ // an id change is coming from the server so no need to resend it
			this.changed.push(model.get('id'));
			this.startTimer();
		}
	},
	startTimer: function(){
		if (this.timer){
			clearTimeout(this.timer);
		}
		this.timer = setTimeout(this.save, 3000);
	},
	save: function(){
		var self = this;
		var toSave = _(this.models).filter(this.containsChanged);
		var params = {
	      url:          this.url,
	      type:         'PUT',
	      contentType:  'application/json',
	      data:         JSON.stringify(toSave),
	      dataType:     'json',
	      processData:  false,
	      success:      function(){self.changed = [];},
	      error:        Statics.errorAlert
	    };
		if (self.changed.length > 0){
			$.ajax(params);
		}
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
		_.bindAll(this, 'changeTaskCompleted','setTasksUrl');
		this.tasks = new TaskList();
		this.setTasksUrl();
		this.tasks_el = this.options.tasks_el;
		this.tasks.bind('change:completed', this.changeTaskCompleted);
		this.tasks.bind('remove', this.changeTaskCompleted);
		this.model.bind('change:id', this.setTasksUrl);
		this.template = _.template(storyTemplate); 
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
		html = $(this.template({object:this.model, css:this.css}));
		//Adds story specific icons
		$(".ui-icon-plusthick, .ui-icon-triangle-1-e, .ui-icon-trash, .ui-icon-pencil, .ui-icon-pin-w",  html).button();
		//mark changed
		$(this.el).html(html);
		//bind model for sorting events
		$(this.el).data('model', this.model);
		return this;
	},
	setTasksUrl: function(){this.tasks.url = Statics.settings.tasksUrl?Statics.settings.tasksUrl({storyId:this.model.get('id')}):"/stories/"+this.model.get('id')+"/tasks";},
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
	showTasks : function(event){
		if (_.isUndefined(this.taskContainer)){
			this.taskContainer = new TaskListView({
				collection: this.tasks,
				el: this.tasks_el
			});
			//don't try to fetch if its a new model
			if (!this.model.isNew()){
				$(this.tasks_el).html($('<img>',{src:'/public/images/loadingTxt.gif',alt:'Loading tasks'}));
				this.tasks.fetch();
			}else { 
				this.taskContainer.render();
			}
		} else {
			this.taskContainer.render();
		}
		$(this.tasks_el).offset({top:$(this.el).position().top - 5});
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
	    	if (sv.visible !== false){
		      $(self.el).append(sv.render().el);
		      sv.delegateEvents();
	    	}
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
		//this.save = setTimeout(dataSet.save, 5000);
	},
	onDragStart : function(event, ui){
		/*if(this.save){
			clearTimeout(this.save);
		}*/
	}
	
});

var StoryListView = SortableView.extend({
	initialize: function (){
		_.bindAll(this, "changeShowHideCompleted","showHideCompleted");
		this.bind('change:showHideCompleted', this.changeShowHideCompleted);
		this.collection.bind('change:completed', this.showHideCompleted)
		SortableView.prototype.initialize.call(this);
	},
	viewFactory: function(model){
		return new StoryView({model:model, tasks_el:this.options.tasks_el});
	},
	render:function(){
		SortableView.prototype.render.call(this);
		if (this.collection == null || this.collection.length == 0){
			$(this.el).empty().append("<b>No stories</b>");
		}else{
			this.showHideCompleted();
		}
	},
	changeShowHideCompleted: function(hideCompleted){
		this.hideCompleted = hideCompleted;
		this.showHideCompleted();
	},
	showHideCompleted: function(){
		if (this.hideCompleted===true){
			var self = this;
			this.collection.each(function(model, index){
				if (model.get('completed') === true){
					model.view.setInvisible();
					if (index === self.selected){
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

var TaskListView = SortableView.extend({
	viewFactory: function(model){
		return new TaskView({model:model});
	},
	render:function(){
		SortableView.prototype.render.call(this);
		if (this.collection == null || this.collection.length == 0){
			$(this.el).empty().append(TaskViewStatics.getNoTaskAvailableBlock());
		}
	}
});

var SprintListView = CollectionView.extend({
	viewFactory: function(model){
		return new SprintView({model:model});
	}
});

var SprintStoriesView = Backbone.View.extend({
	initialize:function(){
		_.bindAll(this, "addStory");
		this.render();
		this.collection = this.options.collection;
		this.sprint = this.options.sprint;
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
			this.storyList.trigger('change:showHideCompleted', true);
		}else{
			this.storyList.trigger('change:showHideCompleted', false);
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