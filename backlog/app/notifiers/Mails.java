package notifiers;

import java.lang.reflect.InvocationTargetException;

import org.apache.commons.beanutils.PropertyUtils;

import com.googlecode.objectify.Key;

import models.Story;
import models.Task;
import models.User;
import play.exceptions.MailException;
import play.modules.objectify.ObjectifyModel;
import play.mvc.Mailer;

public class Mails extends Mailer {
	
	
	public static<T extends ObjectifyModel<T>>  void notifyAssignment(T task){
		if (task == null){
			play.Logger.warn("Null task has been sent to be emailed");
			return;
		}
		if (task instanceof Task || task instanceof Story) {
			try {
				Object property = PropertyUtils.getProperty(task, "assignee");
				String name = (String)PropertyUtils.getProperty(task, "name");
				String displayName = "";
				if (name != null){
					displayName = name.substring(0, name.length() > 15? 15 : name.length());
				}
				if (property != null){
					User user = User.findByKey((Key<User>) property);
					if (user != null){
						String email = user.email;
						String taskUrl = "";
						setSubject("Task assignment %s ..", displayName);
						addRecipient(email);
						setFrom("Easyagile <notifier@easyagile.appspotmail.com>");
						send(task, taskUrl);
					}
				}
			} catch (Exception e) {
				throw new MailException("Unable to send email", e);
			}
		}
	}

}
