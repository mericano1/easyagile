package models;

import java.util.List;

import javax.persistence.Id;

import play.data.validation.Required;
import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyModel;

import com.googlecode.objectify.Key;

public class Story extends ObjectifyModel<Story>{
	@Id 
	public Long id;
    @Required 
    public String name;
    public String description;
    public Integer points;
    public Integer index;
    public Key<Sprint> sprint;
    
    public static Story findById(Long storyId) {
    	Key<Story> key = new Key<Story>(Story.class, storyId);
    	//Key<Story> key = Datastore.key(Sprint.class, sprintId, Story.class, storyId);
        return Datastore.find(key);
    }
    
    public static List<Story> findUnassigned() {
    	List<Story> list = Datastore.query(Story.class)
    	.filter("sprint", null)
    	.order("index").list();
        return list;
    }
    
    public static List<Story> findBySprint(Long sprintId) {
    	List<Story> list = Datastore.query(Story.class)
    	.filter("sprint", Datastore.key(Sprint.class, sprintId))
    	.order("index")
    	.list();
        return list;
    }
    
    public static Story findById(Key<Story> key) {
        return Datastore.find(key, false);
    }
    
    public static List<Story> findAll() {
        return Datastore.query(Story.class).order("index").list();
    }
    
    public Key<Story> save() {
        return Datastore.put(this);
    }
    
    public void delete() {
        Datastore.delete(this);
    }


}
