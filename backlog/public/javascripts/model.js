//-----------------------------------------------------------------------
// BaseBlock
//-----------------------------------------------------------------------

BaseBlock.defaultSettings = {
	convertJsonFields : ["id", "name", "description", "points", "index", "tasks", "deleted", "completed","assignee"],
	css:{
		completed:"taskSummary-completed",
		incompleted:"taskSummary",
		wrapper:"ui-widget",
		summary: "ui-state-highlight"
	},
	dialog : {
		autoOpen: false,
		height: 480,
		width: 380,
		modal: true,
		resizable: true
	}
};
//sort function based on element index
BaseBlock.sortFunction = function (a,b) {
	return  (a.info.index < b.info.index) ? -1 : (a.info.index > b.info.index) ? 1 : 0;
};

function BaseBlock(info, container, options){
	this.info = (info == undefined || info == null) ? {} : info;
	this.container = container;
	this.visible = true;
	this.changed = false;
	this.settings = $.extend(true, BaseBlock.defaultSettings, options?options:{});
	this.isChanged = function(){return this.changed;}
	this.isDeleted = function(){return this.info.deleted;}
	this.markDeleted = function() {
		this.info.deleted = true;
	}
	this.unmarkDeleted = function() {
		this.info.deleted = false;
	}
	this.markChanged = function(){
		this.changed = true;
		this.addDisplayChangedBlock();
	}
	this.unmarkChanged = function(){
		this.changed = false;
		this.removeDisplayChangedBlock();
	}
	this.markComplete = function(){
		this.info.completed = true;
		$("." + this.settings.css.incompleted, this.block)
			.removeClass(this.settings.css.incompleted)
			.addClass(this.settings.css.completed);
	}
	this.unmarkComplete = function(){
		this.info.completed = false;
		$("." + this.settings.css.completed, this.block)
			.removeClass(this.settings.css.completed)
			.addClass(this.settings.css.incompleted);
	}
	//returns true if the object has the complete attribute (is it not undefined)
	this.hasCompleteStatus = function(){
		return (this.info.completed != undefined);
	}
	this.isComplete = function() {
		return (this.hasCompleteStatus()) ? this.info.completed : undefined; 
	}
	this.addDisplayChangedBlock = function(){
		$("<span class='changed'>").append("*").insertAfter(this.getDisplayNameBlock());
	}
	//returns true if this element can be completely removed ( it has never been saved in the backend)
	//false otherwise
	this.remove = function(){
		this.block.remove();
		if (this.getId()){
			this.markDeleted();
			this.markChanged();
			return false;
		}else {
			return true;
		}
	}
	this.removeDisplayChangedBlock = function(){$(".changed", this.block).remove();}
	this.getDisplayNameBlock = function(){return $(".storyOrTask-name", this.block);}
	this.getDisplayName = function(){return this.getDisplayNameBlock().text();}
	this.setDisplayName = function(string){$(".storyOrTask-name", this.block).text(string);}
	this.getDisplayDescription = function(){return $(".storyOrTask-description", this.block).html();}
	this.setDisplayDescription = function(string){$(".storyOrTask-description", this.block).html(string);}
	this.getDisplayIndex = function(){return $(".priority", this.block).text();}
	this.setDisplayIndex = function(string){$(".priority", this.block).text(string);}
	this.getDisplayPoints = function(){return $(".points", this.block).text();}
	this.setDisplayPoints = function(string){$(".points", this.block).text(string);}
	this.setVisible = function(){this.visible = true; this.block.show();}
	this.setInvisible = function(){this.visible = false; this.block.hide();}
	this.isVisible= function(){return this.visible ;}
	this.getId = function() {return this.info.id;}
	this.getName = function() {return this.info.name;}
	this.getDescription = function() {return this.info.description;}
	this.getPoints = function() {return this.info.points;}
	this.getIndex = function() {return this.info.index;}
	this.setIndex = function(idx) {this.info.index = idx;}
	this.getFormDialog = BaseBlock.getFormDialog;
	this.showAddNewForm = BaseBlock.showAddNewForm;
	
	this.setIndex = function(idx){
		this.info.index = idx;
		this.setDisplayIndex(idx + 1);
	}
	this.setName = function(string){
		this.setDisplayName(string);
		this.info.name = string;
	}
	this.setDescription = function(string){
		this.setDisplayDescription(string);
		this.info.description = string;
	}
	this.setPoints = function(points){
		this.setDisplayPoints(points);
		this.info.points = points;
	}
	
	this.sortFunction = BaseBlock.sortFunction;
	this.toJson = function(){return JSON.stringify(this.info, this.settings.convertJsonFields);}
	
	
	
	
}

BaseBlock.closeDialog = function(){$( this ).dialog( "close" );}
//reuse the dialog if it exists
BaseBlock.getFormDialog= function(buttons){
	form = $(this.getFormBlockId());
	if (form.length == 0){
		form = this.getBlankFormBlock();
	} else { //clear existing
		$('form', form)[0].reset()
	}
	dialogOptions = this.settings.dialog;
	dialogOptions.buttons = buttons;
	$(form).dialog(dialogOptions);
	return $(form);
}


//shows the add new form
BaseBlock.showAddNewForm = function(onSave, onCancel){
	var buttons = {
			"Save" : onSave,
			"Cancel": onCancel,
			"Save and Add another": function(){
				onSave(); 
				this.showAddNewForm(onSave, onCancel, display)
			}
	};
	form = this.getFormDialog(buttons);
	$(form).dialog('open');
	return $(form);
}

//shows the edit current form
BaseBlock.prototype.showEditForm = function(onSave, onCancel){
	var buttons = {
			"Save" : onSave,
			"Cancel": onCancel
		};
	form = this.getFormDialog(buttons);
	$( "#name", form ).val(this.info.name);
	$( "#description", form  ).val(this.info.description);
	$( "#points", form).val(this.info.points);
	$(form).dialog('open');
	return $(form);
}

//gets the html of the block itself
BaseBlock.prototype.getHtmlBlock= function (object, index){
	summaryClass = this.settings.css.summary;
	if (this.hasCompleteStatus()){
		summaryClass = this.isComplete() ? this.settings.css.completed : this.settings.css.incompleted;
	}
	htmlCode = "<div class='" + this.settings.css.wrapper + "'>" +
					"<div class='" + summaryClass + " ui-corner-all' style='padding: 0 .7em; '>" + 
							"<p>" +
								"<span class='ui-icon ui-icon-info' style='float: left; margin-right: .3em;'></span>" +
								"<span class='ui-icon ui-icon-trash' title='delete' style='float: right; margin-left: .3em;'></span>" + 
								"<span class='ui-icon ui-icon-pencil' title='edit'style='float: right; margin-left: .3em;'></span>" + 
								"<strong class='storyOrTask-name' style='display:block'>"+ (object.name?object.name:"") +"</strong>" +
								"<div class='storyOrTask-description'>" + (object.description?object.description:"") +"</div>" +
							"</p>" +
						"<div class='card-info'>" +
							"<span class='priority'>" + (isNaN(object.index)? "" : (object.index + 1) ) + "</span>" +
							"<span class='points'>" + (object.points?object.points:"") + "</span>" + 
								"<div style='clear:both;'/>" + 
								"</div>" +
						"</div>" +
					"</div>" +
				"</div>";
	return $(htmlCode);
}

BaseBlock.getFormBlock= function(){
	html = "<div> " +
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
	return $(html);
}


BaseBlock.prototype.getValuedFormBlock = function(){
	html = this.getBlankFormBlock();
	$("#name", html).val(this.info?this.info.name:"");
	$("#description", html).val(this.info?this.info.description:"");
	$("#points", html).val(this.info?this.info.points:"");
	return html;
}


//-----------------------------------------------------------------------
//Stories
//-----------------------------------------------------------------------
Story.getFormDialog = BaseBlock.getFormDialog;
Story.settings = BaseBlock.defaultSettings;
Story.getFormBlockId = function(){return "dialog-form-story";}
Story.getBlankFormBlock = function(){
	html = BaseBlock.getFormBlock.call(this);
	html.attr("id", Story.getFormBlockId());
	html.attr("title", "Story details");
	return html;
}
Story.showAddNewForm=function(){
	return BaseBlock.showAddNewForm.call(this,
			function(){alert("save")}, 
			BaseBlock.closeDialog
		);
}
Story.prototype = new BaseBlock;
function Story(info, container, options){
	BaseBlock.call(this, info, container, $.extend(true, {css:{
			summary:"storySummary",
			completed:"storySummary-completed",
			incompleted:"storySummary",
		}},options));// Call super-class constructor
	this.getHtmlBlock = function(object, index){
		html = BaseBlock.prototype.getHtmlBlock.call(this,object, index);
		$("<span class='ui-icon ui-icon-triangle-1-e' title='Show tasks'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-info",html));
		$("<span class='ui-icon ui-icon-plusthick' title='Add task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil", html));
		return html;
	}
	this.block = $(this.getHtmlBlock(this.info));
	this.getFormBlockId = Story.getFormBlockId;
	this.getBlankFormBlock = Story.getBlankFormBlock;
	this.showAddNewForm = Story.showAddNewForm;
	
	//binds data to the html element
	this.block.data("element", this);
	this.block.data("type", "story");
}


//This function is used in the container and (this) is the container object
Story.factory = function(elements){
	var stories = [];
	$(elements).each(function(index, child){
		stories.push(new Story(child));
	});
	return stories;
}




//-----------------------------------------------------------------------
// Tasks
//-----------------------------------------------------------------------
Task.getFormDialog = BaseBlock.getFormDialog;
Task.settings = BaseBlock.defaultSettings;
Task.getFormBlockId = function(){return "dialog-form-task";}
Task.getBlankFormBlock =  function(){
	html = BaseBlock.getFormBlock.call(this);
	html.attr("id", Task.getFormBlockId());
	html.attr("title", "Task details");
	return html;
}
Task.showAddNewForm=function(){
	return BaseBlock.showAddNewForm.call(this,
			function(){alert("save")}, 
			BaseBlock.closeDialog
		);
}
Task.prototype = new BaseBlock;
function Task(info, container, options){
	BaseBlock.call(this, info, container, $.extend(true, {css:{
			summary:"taskSummary",
			completed:"taskSummary-completed",
			incompleted:"taskSummary"
			}
	}, options));// Call super-class constructor
	this.getHtmlBlock = function(object, index){
		html = BaseBlock.prototype.getHtmlBlock.call(this,object, index);
		$("<span class='ui-icon-custom ui-icon-user' title='Assign Task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil",html));
		$("<span class='ui-icon ui-icon-check ' title='Mark Completed'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-user", html));
		$("<span class='assignee'>" + ((object.assignee) ? object.assignee : "Not Assigned") + "</span>").insertAfter($(".priority", html));
		return html;
	}
	this.block = $(this.getHtmlBlock(this.info));
	this.getFormBlockId = Task.getFormBlockId
	this.getBlankFormBlock =Task.getBlankFormBlock;
	this.getDisplayAssignee =function(){return $(".assignee", this.block).text();}
	this.getAssignee =function(){return this.info.assignee;}
	//binds data to the html element
	this.block.data("element", this);
	this.block.data("type", "task");
	
}

Task.getNoTaskAvailableBlock = function(container){
	html = new Task({name:"No Tasks are available", description:"Click on 'Add Task' to add one", points:""}, container);
	$(".ui-icon, .points, .priority, .ui-icon-custom", html.block).remove();
	return html;
}

//This is used to create task objects
Task.factory = function(elements){
	var tasks = [];
	$(elements).each(function(index, child){
		tasks.push(new Task(child));
	});
	return tasks;
}


//-----------------------------------------------------------------------
// Container
// data 		-> Array of elements of type BaseBlock
// block 		-> The jQuery html element the children will get 
// loadFunction -> Type specific function on how to create elements and load them
//-----------------------------------------------------------------------
function Container(data, block, loadFunction){
	this.children = data ? data : [];
	this.block = block;

	function init(){
		this.setBlock(block);
		this.makeChildrenSortable();
		if (loadFunction){
			loadFunction.call(this);
		}
	}
	
	//binds data to the html element
	this.setBlock = function(block){
		this.block = block;
		if (block){
			this.block.data("element", this);
			this.block.data("type", "container");
			$(this.children).each(function(index, child){
				block.append(child.block);
			});
		}
	}
	this.get = function(index){
		return this.children[index];
	}
	
	
	this.makeChildrenSortable = function(){
		 $(block).sortable({
				stop: function(event, ui) {
					var item = ui.item;
					var newIndex = $(item).parent().children().index(item);
					var element = item.data("element");
					var prevIndex = element.info.index;
					//update element indexes
					if (prevIndex == newIndex){return;}
					if (prevIndex > newIndex ) { //drag up
						for (i=newIndex; i < prevIndex; i++){
							dataSet[i].index++;
							currentDiv = dataSet[i].div;
							$(".priority", currentDiv).text(dataSet[i].index + 1);
						}
					}
					//prevIndex is still the moved object
					if (prevIndex < newIndex ) { //drag down
						for (i= (prevIndex + 1); i <= newIndex; i++){
							dataSet[i].index--;
							currentDiv = dataSet[i].div;
							$(".priority", currentDiv).text(dataSet[i].index + 1);
						}
					}
					element.setIndex(newIndex);
					children.sort(element.sortFunction);
				},
				start: function(event, ui){
					if (onStart) { onStart();}
				}
			});
	}
	
	this.addChild = function(child) {
		this.children.push(child);
	}
	
	this.removeChild = function(child) {
		element = null;
		if(typeof child == "number"){ //removes index
			element = this.children[child];
		}else if(typeof child == "object"){ //removes index
			element = child;
		}
		if (element != null && element.remove()){
			this.children.splice(child, 1);
		}
	}
	
	this.showChildren = function(wrapperBlock){
		
	}
	
	init.call(this);
}





