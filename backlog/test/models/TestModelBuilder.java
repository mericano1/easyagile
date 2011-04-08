package models;
import java.util.Date;

import models.Story;
import models.Task;

import com.googlecode.objectify.Key;

public class TestModelBuilder {

    public static final String OWNER_1 = "test_1@somewhere.com";
    public static final String OWNER_2 = "test_2@somewhere.com";

    public static Sprint createSimpleSprint(String name, Date start, Date end, Boolean current ) {
    	Sprint sprint = new Sprint();
		sprint.name = name;
		sprint.startDate = start;
		sprint.endDate = end;
		sprint.current = current;
        return sprint;
    }
    
    
    public static Story createSimpleStory(String name, String description, int points, int index, Key<Sprint> sprint) {
    	Story story= new Story();
		story.name = name;
		story.description = description;
		story.index= index;
		story.points= points;
		story.sprint = sprint;
        return story;
    }

    public static Task createSimpleTask(String name, String description, int points, int index, Key<Story> story) {
    	Task task = new Task();
    	task.name = name;
    	task.description = description;
    	task.index= index;
    	task.points= points;
    	task.story= story;
        return task;
    }

}
