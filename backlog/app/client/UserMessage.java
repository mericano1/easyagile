package client;

public class UserMessage {
	public static UserMessage SUCCESSFUL = new UserMessage("OK");
	public static UserMessage UNSUCCESSFUL = new UserMessage("KO");
	public String result;
	public String details;
	
	public UserMessage(String result) {
		super();
		this.result = result;
	}
	
	public UserMessage(String result, String details) {
		super();
		this.result = result;
		this.details = details;
	}


	public static UserMessage successful(String details){
		return new UserMessage("OK", details );
	}
	
	public static UserMessage unsuccessful(String details){
		return new UserMessage("KO", details );
	}
	
	
}
