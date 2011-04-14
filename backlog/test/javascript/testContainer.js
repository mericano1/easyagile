module('container');

test('test container constructor', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},{"id":2002,"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	storyCont = new Container(Story.factory(stories));
	equals(stories.length, storyCont.children.length, "same size");
});


test('test container remove', function(){
	var stories = [{"id":7001,"name":"(NOT SO) Simplest possible create a match","description":"basic web application to create a match, send notification to friends and collect participations","points":14,"index":0},
	               {"name":"Int tests for features","description":"","points":5,"index":1},{"id":2003,"name":"Feedback slideout","description":"","points":3,"index":2},{"id":6001,"name":"Publish to prod","description":"","index":3},{"id":16001,"name":"Logged user redirected to player home","description":"After login the user should be redirected to player home page","index":4},{"id":17001,"name":"Add password","description":"After a participant follows the link from the email and goes to the MatchPlayer page, if the user is not registered (not password) a button should appear to allow the user to add a password","points":0,"index":5},{"id":18001,"name":"Error page","description":"Add a nice error page to redirect in case of errors","index":6},{"id":15001,"name":"Customer feedback","description":"we need to talk to the users / customers to get a better idea of what we need\u003cbr/\u003e\nCheck tasks-\u003e","index":7},{"id":11001,"name":"Add button to ask system to resend confirmation email","description":"If the user deleted email, he won\u0027t be able to login. (From mike- need clarification on exactly what this means. Forgot now).","points":0,"index":8},{"id":8004,"name":"Player edit","index":9},{"id":7003,"name":"Match update- should go back to MatchPlayerHome. No new emails sent.","index":10},{"id":7002,"name":"Color of items in menu bar- make better","index":11},{"id":7005,"name":"Style MatchPlayerHome","index":12},{"id":9005,"name":"No allow duplicate emails in system","index":13},{"id":11003,"name":"No allow duplicate emails in system","index":14},{"id":11005,"name":"Date picker- make knobs more visible","index":15},{"id":8005,"name":"Automate publish to prod in Hudson","index":16},{"id":10005,"name":"https login","index":17},{"id":7004,"name":"Clean up css","index":18},{"id":9004,"name":"Facebook- select participants from FB","index":19},{"id":7006,"name":"Logout goes to home","index":20},{"id":11004,"name":"Strategy to update db (liquibase?)","index":21},{"id":8008,"name":"Facebook - use fgraph","index":22},{"id":8006,"name":"Style all buttons the same","index":23},{"id":19001,"name":"Cancel button problem in edit player","description":"Cancel button in edit player page is same as back button, so does not necessarily cancel out of the page.","index":24}];
	storyCont = new Container(Story.factory(stories));
	
	storyCont.removeChild(0); 
	equals(storyCont.children.length, stories.length, "same size - just mark deleted");
	equals(storyCont.get(0).isDeleted(), true, "deleted");
	equals(storyCont.get(0).isChanged(), true, "changed");
	
	storyCont.removeChild(1); // first has no id
	equals(storyCont.children.length, stories.length - 1, "1 less element, it had no id");
});