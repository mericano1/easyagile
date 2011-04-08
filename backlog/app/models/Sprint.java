package models;

import java.util.Date;
import java.util.List;

import javax.persistence.Id;

import play.modules.objectify.Datastore;
import play.modules.objectify.ObjectifyModel;

import com.googlecode.objectify.Key;

public class Sprint extends ObjectifyModel<Sprint>{
	@Id 
	public Long id;
	public String name;
	public Date startDate;
	public Date endDate;
	public Boolean current;
	
    public static Sprint findById(Long sprintId) {
    	Key<Sprint> key = Datastore.key(Sprint.class, sprintId);
        return Datastore.find(key);
    }
    
    public static Key<Sprint> findKey(Long sprintId) {
    	return Datastore.key(Sprint.class, sprintId);
    }
    
    public static Sprint findById(Key<Sprint> key) {
        return Datastore.find(key, false);
    }
    
    public static Sprint findCurrentSprint() {
        return Datastore.query(Sprint.class).filter("current", true).get();
    }
    
    public static List<Sprint> findAll() {
        return Datastore.query(Sprint.class).order("startDate").list();
    }
    
    public Key<Sprint> save() {
        return Datastore.put(this);
    }
    
    public void delete() {
        Datastore.delete(this);
    }
}
