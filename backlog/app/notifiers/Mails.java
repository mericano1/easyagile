package notifiers;

import models.Task;
import models.User;
import play.mvc.Mailer;

public class Mails extends Mailer {
	public static void notifyAssignment(Task task){
		if (task == null){
			play.Logger.warn("Null task has been sent to be emailed");
			return;
		}
		User user = User.findByKey(task.assignee);
		if (user != null){
			String email = user.email;
			String taskUrl = "";
			setSubject("Task assignment %s ..", task.name.substring(0, task.name.length() > 15? 15 : task.name.length()));
			addRecipient(email);
			setFrom("Easyagile <notifier@easyagile.appspotmail.com>");
			send(task, taskUrl);
		}
	}

}
