package models;

import javax.persistence.Id;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;
import com.googlecode.objectify.annotation.Parent;

import play.data.validation.Required;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyModel;

public class Task extends ObjectifyModel<Task> {
	@Id 
	public Long id;
    @Required 
    public String name;
    public String description;
    public Integer index;
    public Integer points;
    @Required @Parent public Key<Story> story;

    
    public static Task findById(Long storyId, Long taskId) {
    	Key<Task> key = Datastore.key(Story.class, storyId, Task.class, taskId);
        return Datastore.find(key);

    }
    
    
    public static Task findById(Key<Task> key) {
        return Datastore.find(key);
    }
    
    
    public Key<Task> save() {
        return Datastore.put(this);
    }
    
    public void delete() {
        Datastore.delete(this);
    }
    
    public static Query<Task> findAllByStory(Long storyId) {
    	if (storyId != null) {
            return Datastore.query(Task.class)
                    .ancestor(Datastore.key(Story.class, storyId))
                    .order("index");
        }
        else {
            return null;
        }

    }
    

}
