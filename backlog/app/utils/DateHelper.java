package utils;

import java.util.Calendar;
import java.util.Date;

public class DateHelper {
	public static Date fromNow(int days, int hours, int minutes){
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.HOUR, days * 24);
		calendar.add(Calendar.HOUR, hours);
		calendar.add(Calendar.MINUTE, minutes);
		return calendar.getTime();
		
	}
	
	

}
