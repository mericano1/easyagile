//-----------------------------------------------------------------------
// BaseBlock
//-----------------------------------------------------------------------
function BaseBlock(info, container, options){
	this.info = info;
	this.container = container;
	this.settings = $.extend({
		css:{
			completed:"taskSummary-completed",
			incompleted:"taskSummary",
			wrapper:"ui-widget storySummary",
			summary: "ui-state-highlight"
		},
	}, options?options:{});
}
//gets the html of the block itself
BaseBlock.prototype.getHtmlBlock= function (object, index){
	summaryClass = this.settings.css.summary;
	if (object.completed != undefined){
		summaryClass = object.completed ? this.settings.css.completed : this.settings.css.incompleted;
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

BaseBlock.prototype.getFormBlock= function(){
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

Story.prototype = new BaseBlock;
function Story(info, container, options){
	BaseBlock.call(this, info, container, options);// Call super-class constructor
	this.getHtmlBlock = function(object, index){
		html = BaseBlock.prototype.getHtmlBlock.call(this,object, index);
		$("<span class='ui-icon ui-icon-triangle-1-e' title='Show tasks'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-info",html));
		$("<span class='ui-icon ui-icon-plusthick' title='Add task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil", html));
		return html;
	}
	this.block = $(this.getHtmlBlock(info));
	
	this.getBlankFormBlock = function(){
		html = BaseBlock.prototype.getFormBlock.call(this);
		html.attr("id", "dialog-form-story");
		html.attr("title", "Story details");
		return html;
	}
	
	
		
}







//-----------------------------------------------------------------------
// Tasks
//-----------------------------------------------------------------------

Task.prototype = new BaseBlock;
function Task(info, container, options){
	BaseBlock.call(this, info, container, options);// Call super-class constructor
	this.getHtmlBlock = function(object, index){
		html = BaseBlock.prototype.getHtmlBlock.call(this,object, index);
		$("<span class='ui-icon-custom ui-icon-user' title='Assign Task'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-pencil",html));
		$("<span class='ui-icon ui-icon-check ' title='Mark Completed'style='float: right; margin-left: .3em;'>").insertAfter($(".ui-icon-user", html));
		$("<span class='assignee'>" + ((object.assignee) ? object.assignee : "Not Assigned") + "</span>").insertAfter($(".priority", html));
		return html;
	}
	this.block = $(this.getHtmlBlock(info));
	
	this.getBlankFormBlock = function(){
		html = BaseBlock.prototype.getFormBlock.call(this);
		html.attr("id", "dialog-form-task");
		html.attr("title", "Task details");
		return html;
	}
}








