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
    
    public static Story findById(Long id) {
        return Datastore.find(Story.class, id, false);
    }
    
    public static Story findById(Key<Story> key) {
        return Datastore.find(key, false);
    }
    
    public static List<Story> findAll() {
        return Datastore.query(Story.class).list();
    }
    
    
    public Key<Story> save() {
        return Datastore.put(this);
    }
    
    public void delete() {
        Datastore.delete(this);
    }


}
