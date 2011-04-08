package client;

public class UserMessage {
	public static UserMessage SUCCESSFUL = new UserMessage("OK");
	public static UserMessage UNSUCCESSFUL = new UserMessage("KO");
	public String result;
	
	public UserMessage(String result) {
		super();
		this.result = result;
	}
	
}
